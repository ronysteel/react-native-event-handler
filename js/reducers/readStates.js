// @flow
import type { Action } from '../actions/types'

export type ReadState = {
  episodeId: number;
  readIndex: number;
}

export type ReadStates = {
  [episodeId: number]: ReadState;
}

const initialStates: ReadStates = {}

function readStates(state: ReadStates = initialStates, action: Action): ReadStates {
  switch (action.type) {
    case 'UPDATE_READ_STATE':
      const s = state[action.episodeId] || { episodeId: action.episodeId, readIndex: 0 }
      s.readIndex = s.readIndex + 1

      if (action.scriptLength <= s.readIndex) {
        s.readIndex = action.scriptLength
      }
      return Object.assign({}, state, { [action.episodeId]: s })

    default:
      return state
  }
}

export default readStates
