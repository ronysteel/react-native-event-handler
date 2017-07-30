// @flow
import type { Action } from '../actions/types'

export type StoryPageState = {
  isOpenPromotion: boolean;
}

export type StoryPageStates = {
  [episodeId: number]: StoryPageState;
}

const initialState: StoryPageState = {
  isOpenPromotion: false,
  isOpenEpisodeList: false,
}

const initialStates: StoryPageStates = {}

const update = (state, action, props) => {
  const { episodeId } = action
  const s = Object.assign({}, initialState, state[episodeId], props)
  return Object.assign({}, state, { [episodeId]: s })
}

function storyPageStates(
  state: StoryPageStates = initialStates,
  action: Action,
): StoryPageStates {
  switch (action.type) {
    case 'OPEN_STORY_PAGE_PROMOTION_MODAL_SUCCESS': {
      return update(state, action, {
        isOpenPromotion: true,
      })
    }

    case 'CLOSE_STORY_PAGE_PROMOTION_MODAL_SUCCESS': {
      return update(state, action, {
        isOpenPromotion: false,
      })
    }

    case 'OPEN_STORY_PAGE_EPISODE_LIST_MODAL_SUCCESS': {
      return update(state, action, {
        isOpenEpisodeList: true,
      })
    }

    case 'CLOSE_STORY_PAGE_EPISODE_LIST_MODAL_SUCCESS': {
      return update(state, action, {
        isOpenEpisodeList: false,
      })
    }

    default: {
      return state
    }
  }
}
export default storyPageStates
