// @flow
import type { Action, ThunkAction } from './types'
import { NativeModules } from 'react-native'
const { InAppUtils } = NativeModules

export function loadPurcasingProducts(): ThunkAction {
  const products = [
    'test.skahack.001'
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
