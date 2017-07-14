// @flow
import type { Action, ThunkAction } from './types'
import { getAllScript } from '../reducers/scripts'
import firebase from '../firebase'

const successSignInAnonymously = user => {
  return {
    type: 'SIGN_IN_ANONYMOUSLY_SUCCESS',
    user,
  }
}

export function signInAnonymously(): ThunkAction {
  return dispatch => {
    return firebase.auth().signInAnonymously()
      .then(user => {
        dispatch(successSignInAnonymously(user))
      })
      // TODO: catchしないでerror handlingしたい
  }
}
