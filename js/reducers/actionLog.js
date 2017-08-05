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

type Position = {
  sectionIndex: number;
  positionIndex: number;
}

export type ActionLog = {
  currentScreen: Screen;
  prevScreen: Screen;
  position: ?Position;
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
      const { screenType, params } = action
      const currentScreen = { type: screenType }
      if (screenType == 'NOVEL') {
        currentScreen.novel = {
          id: params.novelId,
          episodeId: params.episodeId,
        }
      }
      const prevScreen = { ...state.currentScreen }
      return {
        ...state,
        ...({ currentScreen, prevScreen }),
      }
    }

    case 'SELECT_CONTENT_SUCCESS': {
      const { sectionIndex, positionIndex } = action
      return {
        ...state,
        ...({
          position: { sectionIndex, positionIndex }
        }),
      }
    }

    default: {
      return state
    }
  }
}
export default actionLog
