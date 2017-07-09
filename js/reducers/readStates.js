// @flow
import type { Action } from '../actions/types'
import type { Script } from './scripts'

export type ReadState = {
  episodeId: number;
  readIndex: number;
  backgroundImageIndex: number;
}

export type ReadStates = {
  [episodeId: number]: ReadState;
}

const initialStates: ReadStates = {}

function isSkippable(script: Script): boolean {
  if (script.type != 'TEXT') {
    return true
  }
  return false
}

function readStates(state: ReadStates = initialStates, action: Action): ReadStates {
  switch (action.type) {
    case 'UPDATE_READ_STATE':
      const { episodeId, scripts, readIndex } = action
      const init = { episodeId: episodeId, readIndex: 0, backgroundImageIndex: 0 }
      const s = state[episodeId] || init

      if (readIndex != undefined) {
        s.readIndex = readIndex
      }

      if (scripts) {
        do {
          s.readIndex = s.readIndex + 1
          if (scripts[s.readIndex] && scripts[s.readIndex].type == 'BACKGROUND_IMAGE') {
            s.backgroundImageIndex = s.readIndex
          }
        } while (scripts[s.readIndex] && isSkippable(scripts[s.readIndex]))

        if (scripts.length <= s.readIndex) {
          s.readIndex = scripts.length
        }
      }

      return Object.assign({}, state, { [episodeId]: s })

    default:
      return state
  }
}

export default readStates
