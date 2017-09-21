// @flow
import type { Action } from '../actions/types'

export type PurchasingProduct = {
  identifier: string,
  currencyCode: string,
  currencySymbol: string,
  description: string,
  downloadable: boolean,
  price: number,
  priceString: string,
  title: string
}

export type PurchasingProducts = {
  isLoaded: boolean,
  isLoading: boolean,
  products: { [id: string]: PurchasingProduct }
}

const initialStates: PurchasingProducts = {
  isLoaded: false,
  isLoading: false,
  products: {}
}

function purchasingProducts (
  state: PurchasingProducts = initialStates,
  action: Action
): PurchasingProducts {
  switch (action.type) {
    case 'LOAD_PURCHASING_PRODUCT_REQUEST': {
      return Object.assign({}, state, {
        isLoading: true
      })
    }

    case 'LOAD_PURCHASING_PRODUCT_FAILED': {
      return Object.assign({}, state, {
        isLoading: false
      })
    }

    case 'LOAD_PURCHASING_PRODUCT_SUCCESS': {
      const { products } = action
      const re = products.reduce((memo, v) => {
        memo[v.identifier] = v
        return memo
      }, {})
      return Object.assign({}, state, {
        isLoading: false,
        isLoaded: true,
        products: re
      })
    }

    default:
      return state
  }
}
export default purchasingProducts
