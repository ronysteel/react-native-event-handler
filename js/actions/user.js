// @flow
import type { Action, ThunkAction } from './types'
import { NativeModules } from 'react-native'
import moment from 'moment'
import { getAllScript } from '../reducers/scripts'
import firebase from '../firebase'
import { loadPurcasingProducts } from './app'
import {
  sendSpendVirtualCurrencyEvnet,
  sendInAppPurchaseSuccessEvent,
  sendInAppPurchaseFailureEvent
} from './event'
import {
  fetchUser,
  verifyReceipt,
  requestGetTicket,
  fetchUserEnergy,
  updateUserEnergy,
  updateReceipt,
  fetchUseTicket
} from '../api'
const { InAppUtils } = NativeModules

const requestSignInAnonymously = () => {
  return { type: 'SIGN_IN_ANONYMOUSLY_REQUEST' }
}

const successSignInAnonymously = user => {
  return {
    type: 'SIGN_IN_ANONYMOUSLY_SUCCESS',
    user
  }
}

export function signInAnonymously (): ThunkAction {
  return (dispatch, getState) => {
    let userObj = {}
    const { session } = getState()

    dispatch(requestSignInAnonymously())

    return firebase
      .auth()
      .signInAnonymously()
      .then(user => {
        firebase.analytics().setUserId(user.uid)
        userObj.uid = user.uid
        return user
      })
      .then(() => updateReceipt().catch(() => {}))
      .then(() => {
        return (
          fetchUser()
            .then(json => {
              if (!json.paidAccountExpiresDate) {
                userObj.paid = false
                return
              }

              userObj.paid =
                Number(json.paidAccountExpiresDate) > moment().valueOf()
            })
            // 初回起動時にまだusers DBにデータがない時がある
            .catch(err => {})
        )
      })
      .then(() => {
        dispatch(successSignInAnonymously(userObj))
      })
    // TODO: catchしないでerror handlingしたい
  }
}

export function saveDeviceToken (): ThunkAction {
  return (dispatch, getState) => {
    const { session } = getState()
    return firebase
      .messaging()
      .getToken()
      .then(token => {
        return firebase
          .database()
          .ref(`/users/${session.uid}`)
          .update({ device_token: token })
      })
  }
}

const purchaseSuccess = ({ expiresDate }) => {
  return {
    type: 'PURCHASE_SUCCESS',
    expiresDate
  }
}

const purchaseFailed = () => {
  return {
    type: 'PURCHASE_FAILED'
  }
}

export function purchase (productId: string): ThunkAction {
  return (dispatch, getState) => {
    return dispatch(loadPurcasingProducts()).then(() => {
      InAppUtils.purchaseProduct(productId, (err, res) => {
        if (res && res.productIdentifier) {
          console.log('Purchase Successful', res)
          const r = JSON.stringify({
            receipt: res.transactionReceipt
          })

          return verifyReceipt({ body: r })
            .then(res => {
              if (!res.expiresDate) {
                return Promise.reject({})
              }
              dispatch(sendInAppPurchaseSuccessEvent())
              return dispatch(purchaseSuccess(res))
            })
            .catch(err => {
              dispatch(sendInAppPurchaseFailureEvent())
              dispatch(purchaseFailed())
            })
        } else {
          console.log('Purchase Failed', res, err)
          dispatch(sendInAppPurchaseFailureEvent())
          return dispatch(purchaseFailed())
        }
      })
    })
  }
}

export function restorePurchases (): ThunkAction {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      InAppUtils.restorePurchases((err, res) => {
        if (err) {
          return reject({ err })
        }
        if (res.length === 0) {
          return reject({ err: 'did not found any purchases', res })
        }
        return resolve({ res })
      })
    })
      .then((res: any) => {
        for (const purchase of res) {
          if (
            purchase.productIdentifier === 'co.newn.chatnovel.onemonth' ||
            purchase.productIdentifier === 'co.newn.chatnovel.oneweek'
          ) {
            const r = JSON.stringify({
              receipt: purchase.transactionReceipt
            })

            return verifyReceipt({ body: r })
          }
        }

        return Promise.reject({ err: 'did not found any purchases' })
      })
      .then(res => {
        if (!res.expiresDate) {
          return Promise.reject({ err: '' })
        }

        return dispatch({
          type: 'RESTORE_PURCHASE_SUCCESS',
          expiresDate: res.expiresDate
        })
      })
      .catch(() => {
        dispatch({
          type: 'RESTORE_PURCHASE_FAILED'
        })
        return Promise.reject()
      })
  }
}

export function decreaseUserEnergy (
  userId: string,
  amount: ?number
): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve()).then(() =>
      dispatch({
        type: 'DECREASE_USER_ENERGY_SUCCESS',
        userId,
        amount
      })
    )
  }
}

export function syncUserEnergy (
  userId: string,
  force: boolean = false
): ThunkAction {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let limit = 100
      // https://stackoverflow.com/questions/30505960/use-promise-to-wait-until-polled-condition-is-satisfied
      ;(function waitForEnergy () {
        if (!getState().energy.isLoading) return resolve()
        if (limit-- == 0) return reject()
        setTimeout(waitForEnergy, 10)
      })()
    }).then(() => {
      const { energy } = getState()
      if (
        energy.nextRechargeDate &&
        energy.nextRechargeDate - moment().valueOf() < 0
      ) {
        force = true
      }

      if (!force && energy.energy === energy.latestSyncedEnergy) {
        return Promise.resolve()
      }

      if (!force && energy.energy > 0) {
        return Promise.resolve()
      }

      dispatch({ type: 'SYNC_USER_ENERGY_REQUEST' })

      return fetchUserEnergy()
        .then(v => {
          if (!v) {
            dispatch({ type: 'SYNC_USER_ENERGY_FAILED' })
            return Promise.reject()
          }

          if (!energy.latestSyncedAt || v.updatedAt > v.latestSyncedAt) {
            return v
          }
        })
        .then(loadedEnergy => {
          const ext = loadedEnergy ? {} : { energy: energy.energy }
          const base = {
            latest_synced_at: firebase.database.ServerValue.TIMESTAMP,
            updated_at: firebase.database.ServerValue.TIMESTAMP
          }

          return updateUserEnergy(Object.assign({}, ext))
            .then(() => fetchUserEnergy())
            .then(v =>
              dispatch({
                type: 'SYNC_USER_ENERGY_SUCCESS',
                energy: v.energy,
                latestSyncedAt: v.latestSyncedAt,
                nextRechargeDate: v.nextRechargeDate,
                ticketCount: v.ticketCount,
                remainingTweetCount: v.remainingTweetCount
              })
            )
        })
    })
  }
}

export function useTicket (): ThunkAction {
  return (dispatch, getState) => {
    dispatch({ type: 'USE_TICKET_REQUEST' })

    return fetchUseTicket()
      .then(v => {
        dispatch(sendSpendVirtualCurrencyEvnet())
        return dispatch({
          type: 'USE_TICKET_SUCCESS'
        })
      })
      .catch(err =>
        dispatch({
          type: 'USE_TICKET_FAILED'
        })
      )
  }
}

export function getTicket (): ThunkAction {
  return (dispatch, getState) => {
    dispatch({ type: 'GET_TICKET_REQUEST' })

    return requestGetTicket()
      .then(v => {
        return dispatch({
          type: 'GET_TICKET_SUCCESS'
        })
      })
      .catch(err =>
        dispatch({
          type: 'GET_TICKET_FAILED'
        })
      )
  }
}

export function tutorialEnd (): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve()).then(() =>
      dispatch({ type: 'TUTORIAL_END_SUCCESS' })
    )
  }
}
