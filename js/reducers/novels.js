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
      const { novel_id, metadata } = action.episode
      const novelId = novel_id
      const s = Object.assign({}, state[novelId] || {}, {
        novelId: parseInt(novelId),
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
        episodeIds: episodes.map(v => v.episode_id)
      })
      return Object.assign({}, state, { [novelId]: s })
    }

    default:
      return state
  }
}

export default novels
