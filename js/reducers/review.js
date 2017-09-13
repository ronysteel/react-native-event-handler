// @flow
import type { Action } from '../actions/types'
import DeviceInfo from 'react-native-device-info'

export type Review = {
  version: ?string;
  finishReadingCount: ?number;
  reviewRequestEnded: boolean;
}

const initialState: Review = {
  version: '0.0.0',
  finishReadingCount: 0,
  reviewRequestEnded: false,
}

function review(state: Review = initialState, action: Action): Review {
  switch (action.type) {
    case "SETUP_REVIEW_STATUS": {
      const { version } = state

      let currentVersion = DeviceInfo.getVersion().split('.')
      let reviewVersion = version.split('.')
      if (currentVersion.length > 1 && reviewVersion.length > 1) {
        // バージョンアップがないかMajor,Minorを比較
        if (currentVersion[0] != reviewVersion[0] || currentVersion[1] != reviewVersion[1]) {
          let state = initialState
          state.version = [currentVersion[0], currentVersion[1]].join('.')
          return state
        }
      }
      return state
    }
    case "FINISH_READING_NOVEL": {
      const { finishReadingCount } = state
      return { ...state, finishReadingCount: finishReadingCount + 1 }
    }
    case "FINISH_REQUEST_REVIEW": {
      const { reviewRequestEnded } = state
      return { ...state, reviewRequestEnded: true }
    }
    default:
      return state
  }
}

export default review
