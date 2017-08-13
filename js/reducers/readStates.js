// @flow
import type { Action } from '../actions/types'
import type { Script } from './scripts'
import type { Energy } from './reducers/energy'

export type ReadState = {
  episodeId: number;
  readIndex: number;
  backgroundImageIndex: number;
  displayPromotion: boolean;
  reachEndOfContent: boolean;
}

export type ReadStates = {
  [episodeId: number]: ReadState;
}

const initialStates: ReadStates = {}

function isSkippable(script: Script): boolean {
  if (script.type != 'TEXT' &&
      script.type != 'DESCRIPTION' &&
      script.type != 'IMAGE') {
    return true
  }
  return false
}

// const maxReadNum = 100
const maxReadNum = 10

function isRead(readIndex: number, paid: boolean, energy: number, tutorialEnded: boolean) {
  if (!tutorialEnded) {
    return true
  }

  if (paid) {
    return true
  }

  if (readIndex <= maxReadNum) {
    return true
  }

  if (energy > 0) {
    return true
  }

  return false
}

function readStates(state: ReadStates = initialStates, action: Action): ReadStates {
  switch (action.type) {
    case 'UPDATE_READ_STATE': {
      const { episodeId, scripts, readIndex, paid, energy, tutorialEnded } = action
      const init = {
        episodeId: episodeId,
        readIndex: 0,
        backgroundImageIndex: 0,
        displayPromotion: false,
        reachEndOfContent: false,
      }
      const s = Object.assign({}, init, state[episodeId] || {})

      if (readIndex != undefined) {
        s.readIndex = readIndex
        s.reachEndOfContent = false
      }

      s.displayPromotion = !isRead(s.readIndex, paid, energy, tutorialEnded)

      if (scripts && isRead(s.readIndex, paid, energy, tutorialEnded)) {
        do {
          s.readIndex = s.readIndex + 1
          if (scripts[s.readIndex] && scripts[s.readIndex].type == 'BACKGROUND_IMAGE') {
            s.backgroundImageIndex = s.readIndex
          }
        } while (scripts[s.readIndex] && isSkippable(scripts[s.readIndex]))

        const len = Object.keys(scripts).length
        if (len < s.readIndex) {
          s.readIndex = len
          s.reachEndOfContent = true
        }
      }

      return Object.assign({}, state, { [episodeId]: s })
    }

    default:
      return state
  }
}

export default readStates
