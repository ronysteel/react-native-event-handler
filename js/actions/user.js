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
    let userObj = {}

    return firebase.auth().signInAnonymously()
      .then(user => {
        userObj.uid = user.uid
        return user.getIdToken().then(token => {
          userObj.idToken = token
          return user
        })
      })
      .then(user => {
        dispatch(successSignInAnonymously(userObj))
      })
      // TODO: catchしないでerror handlingしたい
  }
}
