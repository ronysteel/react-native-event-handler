// @flow
import type { Action, ThunkAction } from './types'
import { NativeModules } from 'react-native'
import moment from 'moment'
import { getAllScript } from '../reducers/scripts'
import firebase from '../firebase'
import { loadPurcasingProducts } from './app'
import { sendSpendVirtualCurrencyEvnet } from './event'
import {
  fetchUser,
  verifyReceipt,
  requestGetTicket,
  fetchUserEnergy,
  updateUserEnergy,
} from '../api'
const { InAppUtils } = NativeModules

const requestSignInAnonymously = () => {
  return { type: 'SIGN_IN_ANONYMOUSLY_REQUEST' }
}

const successSignInAnonymously = user => {
  return {
    type: 'SIGN_IN_ANONYMOUSLY_SUCCESS',
    user,
  }
}

export function signInAnonymously(): ThunkAction {
  return dispatch => {
    let userObj = {}

    dispatch(requestSignInAnonymously())

    return firebase.auth().signInAnonymously()
      .then(user => {
        userObj.uid = user.uid
        return user.getIdToken().then(token => {
          userObj.idToken = token
          return user
        })
      })
      .then(() => fetchUser())
      .then(json => {
        if (!json.paid_account_expires_date) {
          userObj.paid = false
          return
        }

        userObj.paid = Number(json.paid_account_expires_date) > (new Date().getTime())
      })
      .then(() => {
        dispatch(successSignInAnonymously(userObj))
      })
      // TODO: catchしないでerror handlingしたい
  }
}

export function saveDeviceToken(): ThunkAction {
  return (dispatch, getState) => {
    const { session } = getState()
    return firebase.messaging()
      .getToken()
      .then(token => {
        return firebase.database()
          .ref(`/users/${session.uid}`)
          .update({ device_token: token })
      })
  }
}

const purchaseSuccess = () => {
  return {
    type: 'PURCHASE_SUCCESS',
  }
}

const purchaseFailed = () => {
  return {
    type: 'PURCHASE_FAILED',
  }
}

export function purchase(productId: string): ThunkAction {
  return (dispatch, getState) => {
    const { idToken } = getState().session

    return loadPurcasingProducts
      .then(() => {
        InAppUtils.purchaseProduct(productId, (err, res) => {
          if (res && res.productIdentifier) {
            console.log('Purchase Successful', res)
            const r = JSON.stringify({
              receipt: res.transactionReceipt,
            })

            return verifyReceipt({ body: r })
              .then(json => dispatch(purchaseSuccess()))
              .catch(err => dispatch(purchaseFailed()))
          } else {
            console.log('Purchase Failed', res, err)
            return dispatch(purchaseFailed())
          }
        })
      })
  }
}

export function restorePurchases(): ThunkAction {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      InAppUtils.restorePurchases((err, res) => {
        if (err) {
          return reject({ err })
        }
        if (res.length === 0) {
          return reject({ err: "did not found any purchases", res })
        }
        return resolve({ res })
      })
    })
    .then(() => dispatch(purchaseSuccess()))
  }
}

export function decreaseUserEnergy(userId: number, amount: ?number): ThunkAction {
  return (dispatch, getState) => {
    return (new Promise(resolve => resolve()))
      .then(() => (
        dispatch({
          type: 'DECREASE_USER_ENERGY_SUCCESS',
          userId,
          amount,
        })
      ))
  }
}

export function syncUserEnergy(userId: number, force: boolean = false): ThunkAction {
  return (dispatch, getState) => {
    const { energy } = getState()

    if (energy.isLoading) {
      return (new Promise((resolve, reject) => reject()))
    }

    if (energy.nextRechargeDate && (energy.nextRechargeDate - moment().valueOf()) < 0) {
      force = true
    }

    if (!force && energy.energy === energy.latestSyncedEnergy) {
      return (new Promise(resolve => resolve()))
    }

    if (!force && energy.energy > 0) {
      return (new Promise(resolve => resolve()))
    }

    dispatch({ type: 'SYNC_USER_ENERGY_REQUEST' })

    return fetchUserEnergy()
      .then(v => {
        if (!v) {
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
          updated_at: firebase.database.ServerValue.TIMESTAMP,
        }

        return updateUserEnergy(Object.assign({}, ext))
          .then(() => fetchUserEnergy())
          .then(v => (
            dispatch({
              type: 'SYNC_USER_ENERGY_SUCCESS',
              energy: v.energy,
              latestSyncedAt: v.latestSyncedAt,
              nextRechargeDate: v.nextRechargeDate,
              ticketCount: v.ticketCount,
              remainingTweetCount: v.remainingTweetCount,
            })
          ))
      })
  }
}

export function useTicket(): ThunkAction {
  return (dispatch, getState) => {
    dispatch({ type: 'USE_TICKET_REQUEST' })

    return fetchUseTicket()
      .then(v => {
        dispatch(sendSpendVirtualCurrencyEvnet())
        return dispatch({
          type: 'USE_TICKET_SUCCESS',
        })
      })
      .catch(err => (
        dispatch({
          type: 'USE_TICKET_FAILED',
        })
      ))
  }
}

export function getTicket(): ThunkAction {
  return (dispatch, getState) => {
    dispatch({ type: 'GET_TICKET_REQUEST' })

    return requestGetTicket()
      .then(v => {
        return dispatch({
          type: 'GET_TICKET_SUCCESS',
        })
      })
      .catch(err => (
        dispatch({
          type: 'GET_TICKET_FAILED',
        })
      ))
  }
}

export function tutorialEnd(): ThunkAction {
  return (dispatch, getState) => {

    return new Promise(resolve => resolve())
      .then(() => dispatch({ type: 'TUTORIAL_END_SUCCESS' }))
  }
}
