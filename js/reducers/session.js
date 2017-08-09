// @flow
import type { Action } from '../actions/types'

export type Session = {
  uid: ?string;
  idToken: ?string;
  paid: boolean;
  tutorialEnded: boolean;
}

const initialStates: Session = {
  uid: undefined,
  idToken: undefined,
  paid: false,
  tutorialEnded: false,
}

function session(state: Session = initialStates, action: Action): Session {
  switch (action.type) {
    case 'SIGN_IN_ANONYMOUSLY_REQUEST': {
      return state
    }

    case 'SIGN_IN_ANONYMOUSLY_SUCCESS': {
      const { user } = action
      return Object.assign({}, state, {
        uid: user.uid,
        idToken: user.idToken,
        paid: user.paid,
        tutorialEnded: false,
      })
    }

    case 'PURCHASE_SUCCESS': {
      return Object.assign({}, state, { paid: true })
    }

    case 'PURCHASE_FAILED': {
      return Object.assign({}, state, { paid: false })
    }

    case 'TUTORIAL_END_SUCCESS': {
      return Object.assign({}, state, { tutorialEnded: true })
    }

    default:
      return state
  }
}
export default session
