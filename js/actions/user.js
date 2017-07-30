// @flow
import type { Action, ThunkAction } from './types'
import { NativeModules } from 'react-native'
import moment from 'moment'
import { getAllScript } from '../reducers/scripts'
import firebase from '../firebase'
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
      .then(user => {
        return fetch('https://us-central1-test-5913c.cloudfunctions.net/api/user', {
          headers: {
            'Authorization': `Bearer ${userObj.idToken}`,
          }
        })
        .then(r => r.json())
        .then(r => {
          const json = r.response
          if (!json.paid_account_expires_date) {
            userObj.paid = false
            return
          }

          userObj.paid = Number(json.paid_account_expires_date) > (new Date().getTime())
        })
      })
      .then(() => {
        dispatch(successSignInAnonymously(userObj))
      })
      // TODO: catchしないでerror handlingしたい
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

export function purchase(): ThunkAction {
  const productIdentifier = 'test.skahack.001'
  const products = [ productIdentifier ]

  return (dispatch, getState) => {
    const { idToken } = getState().session

    InAppUtils.loadProducts(products, (error, products) => {
      InAppUtils.purchaseProduct(productIdentifier, (error, res) => {
        if (res && res.productIdentifier) {
          console.log('Purchase Successful', res)
          const r = JSON.stringify({
            receipt: res.transactionReceipt,
          })

          fetch('https://us-central1-test-5913c.cloudfunctions.net/api/verify-receipt', {
            method: 'POST',
            body: r,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            }
          })
          .then(res => res.json())
          .then(json => dispatch(purchaseSuccess()))
          .catch(err => dispatch(purchaseFailed()))
        } else {
          console.log('Purchase Failed', res, error)
          dispatch(purchaseFailed())
        }
      })
    })
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

const API_HOST = `https://us-central1-test-5913c.cloudfunctions.net/api`
const fetchUserEnergy = ({ idToken }) => (
  fetch(`${API_HOST}/user_energy`, {
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Cache-Control': 'no-cache',
    }
  })
  .then(r => r.json())
  .then(r => r.response)
)

export function syncUserEnergy(userId: number, force: boolean = false): ThunkAction {
  return (dispatch, getState) => {
    const { session, energy } = getState()

    if (energy.nextRechargeDate && (energy.nextRechargeDate - moment().valueOf()) < 0) {
      force = true
    }

    if (!force && energy.energy === energy.latestSyncedEnergy) {
      return (new Promise(resolve => resolve()))
    }

    if (!force && energy.energy > 0) {
      return (new Promise(resolve => resolve()))
    }

    const ref = firebase.database().ref(`/user_energies/${userId}`)
    return fetchUserEnergy(session)
      .then(v => {
        if (!v) {
          return Promise.reject()
        }

        if (!energy.latestSyncedAt || v.updated_at > v.latest_synced_at) {
          return v
        }
      })
      .then(loadedEnergy => {
        const ext = loadedEnergy ? {} : { energy: energy.energy }
        const base = {
          latest_synced_at: firebase.database.ServerValue.TIMESTAMP,
          updated_at: firebase.database.ServerValue.TIMESTAMP,
        }
        return ref.update(Object.assign({}, base, ext))
          .then(() => fetchUserEnergy(session))
          .then(v => (
            dispatch({
              type: 'SYNC_USER_ENERGY_SUCCESS',
              energy: v.energy,
              latestSyncedAt: v.latest_synced_at,
              nextRechargeDate: v.next_recharge_date,
              ticketCount: v.ticket_count,
            })
          ))
      })
  }
}

const fetchUseTicket = ({ idToken }) => (
  fetch(`${API_HOST}/tickets/use`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
    }
  })
  .then(r => {
    if (!r.ok) {
      return Promise.reject({ err: 'failed to useTicket request', status: r.status })
    }
    return r
  })
  .then(r => r.json())
  .then(r => r.response)
)

export function useTicket(): ThunkAction {
  return (dispatch, getState) => {
    const { session } = getState()
    const { uid } = session
    dispatch({ type: 'USE_TICKET_REQUEST' })

    return fetchUseTicket(session)
      .then(v => (
        dispatch({
          type: 'USE_TICKET_SUCCESS',
        })
      ))
      .catch(err => (
        dispatch({
          type: 'USE_TICKET_FAILED',
        })
      ))
  }
}
