// @flow
import type { Action } from '../actions/types'

export type Tweets = {
  remainingTweetCount: number
}

const initialStates: Tweets = {
  remainingTweetCount: 0
}

function tweets (state: Tweets = initialStates, action: Action): Tweets {
  switch (action.type) {
    case 'SYNC_USER_ENERGY_SUCCESS': {
      return {
        ...state,
        ...{ remainingTweetCount: action.remainingTweetCount }
      }
    }

    default: {
      return state
    }
  }
}
export default tweets
