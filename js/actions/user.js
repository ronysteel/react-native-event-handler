// @flow
import type { Action, ThunkAction } from './types'
import { NativeModules } from 'react-native'
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

const loadUserEnergyRequest = (userId: number) => ({
  type: 'LOAD_USER_ENERGY_SUCCESS',
  userId: userId,
})

const loadUserEnergySuccess = (userId: number, json) => ({
  type: 'LOAD_USER_ENERGY_SUCCESS',
  userId: userId,
  userEnergy: json,
})

export function loadUserEnergy(userId: number): ThunkAction {
  return (dispatch, getState) => {
    loadUserEnergyRequest(userId)

    return firebase.database()
      .ref(`/user_energies/${userId}`)
      .once('value').then((snapshot) => {
        const v = snapshot.val()
        if (!v) {
          return Promise.reject()
        }
        return dispatch(successLoadUserEnergySuccess(userId, v))
      })
  }
}
