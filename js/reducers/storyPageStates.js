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
}

const initialStates: StoryPageStates = {}

function storyPageStates(
  state: StoryPageStates = initialStates,
  action: Action,
): StoryPageStates {
  switch (action.type) {
    case 'OPEN_STORY_PAGE_PROMOTION_MODAL_SUCCESS': {
      const { episodeId } = action
      const s = Object.assign({}, initialState, state[episodeId], {
        isOpenPromotion: true,
      })
      return Object.assign({}, state, { [episodeId]: s })
    }

    case 'CLOSE_STORY_PAGE_PROMOTION_MODAL_SUCCESS': {
      const { episodeId } = action
      const s = Object.assign({}, initialState, state[episodeId], {
        isOpenPromotion: false,
      })
      return Object.assign({}, state, { [episodeId]: s })
    }

    default: {
      return state
    }
  }
}
export default storyPageStates
