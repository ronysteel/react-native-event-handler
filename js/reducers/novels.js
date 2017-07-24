// @flow
import type { Action } from '../actions/types'
import type { Script } from './scripts'

export type Novel = {
  novelId: number;
  title: string;
  categoryId: number;
}

export type Novels = {
  [novelId: number]: Novel;
}

const initialStates: Novel = {}

function novels(state: Novels = initialStates, action: Action): Novels {
  switch (action.type) {
    case 'LOAD_NOVEL_METADATA_SUCCESS': {
      const { novelId, metadata } = action
      const s = {
        novelId: parseInt(novelId),
        title: metadata.title,
        categoryId: metadata.categoryId,
      }
      return Object.assign({}, state, { [novelId]: s })
    }

    default:
      return state
  }
}

export default novels
