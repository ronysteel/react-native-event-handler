// @flow
import type { Action } from '../actions/types'

export type Categories = {
  [categoryId: number]: Category;
}

export type Category = {
  name: string;
  shareTitle: string;
}

const initialState: Categories = {}

function categories(
  state: Categories = initialState,
  action: Action,
): Categories {
  switch (action.type) {
    case 'LOAD_CATEGORIES_SUCCESS': {
      const { categories } = action
      return {
        ...state,
        ...categories,
      }
    }

    default: {
      return state
    }
  }
}

export default categories
