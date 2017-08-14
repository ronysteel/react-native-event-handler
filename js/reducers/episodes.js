// @flow
import type { Action } from '../actions/types'

export type Episode = {
  id: number;
  title: string;
  description: string;
  episodeOrder: number;
  theme: string;
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
      const episodeId = action.episodeId
      const scriptIds = (episode => {
        if (episode.scripts) {
          return Object.values(episode.scripts).map(v => v.script.id)
        }
        return []
      })(action.episode)

      let episode = Object.assign({},
        state[episodeId] || { id: episodeId },
        action.episode.episode)
      episode.scriptIds = scriptIds
      return Object.assign({}, state, { [episodeId]: episode })
    }

    case 'LOAD_EPISODE_LIST_SUCCESS': {
      const { novelId, episodes } = action
      return { ...state, ...episodes }
    }

    default:
      return state
  }
}

export default episodes
