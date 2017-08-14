// @flow
import type { Action } from '../actions/types'
import type { Script } from './scripts'

export type Novel = {
  novelId: number;
  title: string;
  categoryId: number;
  episodeIds: Array<number>;
}

export type Novels = {
  [novelId: number]: Novel;
}

const initialStates: Novel = {}

function novels(state: Novels = initialStates, action: Action): Novels {
  switch (action.type) {
    case 'LOAD_EPISODE_SUCCESS': {
      const { novelId, metadata } = action.episode
      const s = Object.assign({}, state[novelId] || {}, {
        novelId: novelId,
        title: metadata.title,
        categoryId: metadata.categoryId,
      })
      return Object.assign({}, state, { [novelId]: s })
    }
    case 'LOAD_EPISODE_LIST_SUCCESS': {
      const { novelId, episodes } = action
      if (!state[novelId]) {
        return state
      }
      const s = Object.assign({}, state[novelId], {
        episodeIds: Object.keys(episodes)
      })
      return Object.assign({}, state, { [novelId]: s })
    }

    default:
      return state
  }
}

export default novels
