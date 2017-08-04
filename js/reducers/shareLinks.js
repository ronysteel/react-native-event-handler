// @flow
import type { Action } from '../actions/types'
import type { Script } from './scripts'

export type ShareLink = {
  default: string;
}

export type ShareLinks = {
  [episodeId: number]: ShareLink;
}

const initialStates: ShareLinks = {}

function shareLinks(state: ShareLinks = initialStates, action: Action): ShareLinks {
  switch (action.type) {
    case 'LOAD_EPISODE_SUCCESS': {
      const { episodeId, episode } = action
      return Object.assign({}, state, { [episodeId]: episode.shareLinks })
    }
    default:
      return state
  }
}

export default shareLinks
