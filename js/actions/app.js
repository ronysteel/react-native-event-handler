// @flow
import type { Action, ThunkAction } from './types'
import { NativeModules } from 'react-native'
const { InAppUtils } = NativeModules

export function loadPurcasingProducts(): ThunkAction {
  const products = [
    'co.newn.chatnovel.oneweek',
    'co.newn.chatnovel.onemonth',
  ]

  return (dispatch, getState) => {
    dispatch({
      type: 'LOAD_PURCHASING_PRODUCT_REQUEST',
    })

    InAppUtils.loadProducts(products, (err, products) => {
      if (err) {
        return dispatch({
          type: 'LOAD_PURCHASING_PRODUCT_FAILED',
        })
      }

      return dispatch({
        type: 'LOAD_PURCHASING_PRODUCT_SUCCESS',
        products,
      })
    })
  }
}

const API_HOST = `https://us-central1-test-5913c.cloudfunctions.net/api`
const fetchTab = ({ idToken, tabName }) => (
  fetch(`${API_HOST}/tabs/${tabName}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
      'Cache-Control': 'no-cache',
    }
  })
  .then(r => r.json())
  .then(r => r.response)
)

export function loadTab(tabName: string = 'home'): ThunkAction {
  return (dispatch, getState) => {
    const { session } = getState()

    dispatch({ type: 'LOAD_TAB_REQUEST', tabName })
    return fetchTab({ idToken: session.idToken, tabName: tabName })
      .then(v => (
        dispatch({
          type: 'LOAD_TAB_SUCCESS',
          tabName,
          tab: v,
        })
      ))
  }
}

export function moveScreen(screenType: string): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() => (
        dispatch({
          type: 'MOVE_SCREEN_SUCCESS',
          screenType,
        })
      ))
  }
}
