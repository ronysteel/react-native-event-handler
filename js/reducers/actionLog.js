// @flow
import type { Action } from '../actions/types'

type Novel = {
  id: string;
  episodeId: string;
  title: string;
  categoryId: number;
}

type Screen = {
  type: 'UNKNOWN' | 'HOME' | 'NOVEL' | 'DEEPLINK';
  novel: ?Novel;
}

export type ActionLog = {
  currentScreen: Screen;
  prevScreen: Screen;
}

const initialState: ActionLog = {
  currentScreen: { type: 'UNKNOWN' },
  prevScreen: { type: 'UNKNOWN' },
}

function actionLog(
  state: ActionLog = initialState,
  action: Action,
): ActionLog {
  switch (action.type) {
    case 'MOVE_SCREEN_SUCCESS': {
      const { screenType } = action
      const currentScreen = {
        type: screenType,
      }
      const prevScreen = Object.assign({}, state.currentScreen)
      return Object.assign({}, state, {
        currentScreen,
        prevScreen,
      })
    }

    default: {
      return state
    }
  }
}
export default actionLog
