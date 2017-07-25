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
    case 'LOAD_SHARE_LINKS_SUCCESS': {
      const { episodeId, links } = action
      return Object.assign({}, state, { [episodeId]: links })
    }
    default:
      return state
  }
}

export default shareLinks
