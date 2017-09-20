// @flow
import type { Action } from '../actions/types'
import { getMajorMinorVersion, compareAppVersion } from '../utils'

export type Review = {
  version: ?string,
  finishReadingCount: ?number,
  reviewRequestEnded: boolean
}

const initialState: Review = {
  version: '0.0.0',
  finishReadingCount: 0,
  reviewRequestEnded: false
}

function review (state: Review = initialState, action: Action): Review {
  switch (action.type) {
    case 'SETUP_REVIEW_STATUS': {
      const { version } = state
      const { currentVersion } = action

      if (compareAppVersion(currentVersion, version)) {
        return {
          ...initialState,
          version: currentVersion
        }
      }

      return state
    }
    case 'FINISH_READING_NOVEL': {
      const { finishReadingCount } = state
      return { ...state, finishReadingCount: finishReadingCount + 1 }
    }
    case 'FINISH_REQUEST_REVIEW': {
      return { ...state, reviewRequestEnded: true }
    }
    default:
      return state
  }
}

export default review
