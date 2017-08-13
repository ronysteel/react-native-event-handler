// @flow
import type { Action } from '../actions/types'

export type Tutorial = {
  novelId: string;
  episodeId: string;
}

const initialState: Tutorial = {
  novelId: '',
  episodeId: '',
}

function tutorial(
  state: Tutorial = initialState,
  action: Action,
): Tutorial {
  switch (action.type) {
    case 'LOAD_TUTORIAL_SUCCESS': {
      const { novelId, episodeId } = action
      return { ...state, novelId, episodeId }
    }

    default: {
      return state
    }
  }
}
export default tutorial
