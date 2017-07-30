// @flow
import type { Action } from '../actions/types'
import type { Script } from './scripts'

export type Recommends = {
  [categoryId: number]: Array<Recommend>;
}

export type Recommend = {
  novelId: number;
  episodeId: number;
  title: string;
  description: string;
  episodeUri: string;
  thumbnailUrl: string;
}

const initialStates: Recommends = {}

function recommends(state: Recommends = initialStates, action: Action): Recommends {
  switch (action.type) {
    case 'LOAD_RECOMMENDS_SUCCESS': {
      const { categoryId, recommends } = action
      const rs = []
      for (i in recommends) {
        const v = recommends[i]
        rs.push({
          title: v.title,
          description: v.description,
          novelId: v.novel_id,
          episodeId: v.episode_id,
          episodeUri: v.episode_uri,
          thumbnailUrl: v.thumbnail_url,
        })
      }
      return Object.assign({}, state, { [categoryId]: rs })
    }
    default:
      return state
  }
}

export default recommends