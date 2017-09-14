// @flow
import type { Action } from '../actions/types'
import DeviceInfo from 'react-native-device-info'
import { getMajorMinorVersion, compareAppVersion } from '../containers/utils'

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

      let appVersion = DeviceInfo.getVersion()
      if (compareAppVersion(appVersion, version)) {
        let state = initialState
        state.version = getMajorMinorVersion(appVersion)
        return state
      }

      return state
    }
    case 'FINISH_READING_NOVEL': {
      const { finishReadingCount } = state
      return { ...state, finishReadingCount: finishReadingCount + 1 }
    }
    case 'FINISH_REQUEST_REVIEW': {
      const { reviewRequestEnded } = state
      return { ...state, reviewRequestEnded: true }
    }
    default:
      return state
  }
}

export default review
