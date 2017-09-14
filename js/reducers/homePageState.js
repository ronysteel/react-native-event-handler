// @flow
import type { Action } from '../actions/types'

export type HomePageState = {
  isOpenSetting: boolean
}

const initialState: HomePageState = {
  isOpenSetting: false
}

function homePageState (
  state: HomePageState = initialState,
  action: Action
): HomePageState {
  switch (action.type) {
    case 'OPEN_HOME_PAGE_SETTING_MODAL_SUCCESS': {
      return Object.assign({}, state, {
        isOpenSetting: true
      })
    }

    case 'CLOSE_HOME_PAGE_SETTING_MODAL_SUCCESS': {
      return Object.assign({}, state, {
        isOpenSetting: false
      })
    }

    default: {
      return state
    }
  }
}
export default homePageState
