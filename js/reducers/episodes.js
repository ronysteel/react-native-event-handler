// @flow
import type { Action } from '../actions/types'

export type Episode = {
  id: number;
  title: string;
  description: string;
  episodeOrder: number;
  novelId: number;
  scriptIds: Array<number>;
}

export type Episodes = {
  [id: number]: Episode;
}

const initialStates: Episodes = {}

function episodes(state: Episodes = initialStates, action: Action): Episodes {
  switch (action.type) {
    case 'LOAD_EPISODE_SUCCESS': {
      const episodeId = action.episode.id
      const scriptIds = (episode => {
        if (episode.scripts) {
          return episode.scripts.map(v => v.script.id)
        }
        return []
      })(action.episode)

      const episode = state[episodeId] || { id: episodeId }
      episode.scriptIds = scriptIds
      return Object.assign({}, state, { [episodeId]: episode })
    }
    case 'LOAD_EPISODE_LIST_SUCCESS': {
      const { novelId, episodes } = action
      const es = episodes.reduce((memo, v) => {
        memo[v.episode_id] = Object.assign({}, state[v.episode_id] || {}, {
          id: v.episode_id,
          title: v.title,
          episodeUri: v.episode_uri,
          episodeOrder: v.episode_order,
        })
        return memo
      }, {})
      return Object.assign({}, state, es)
    }

    default:
      return state
  }
}

export default episodes
