// @flow
import type { Action } from '../actions/types'

export type Session = {
  uid: ?string;
  idToken: ?string;
  paid: boolean;
}

const initialStates: Session = {
  uid: undefined,
  idToken: undefined,
  paid: false,
}

function session(state: Session = initialStates, action: Action): Session {
  switch (action.type) {
    case 'SIGN_IN_ANONYMOUSLY_SUCCESS': {
      const { user } = action
      return {
        uid: user.uid,
        idToken: user.idToken,
        paid: user.paid,
      }
    }

    case 'PURCHASE_SUCCESS': {
      return Object.assign({}, state, { paid: true })
    }

    case 'PURCHASE_FAILED': {
      return Object.assign({}, state, { paid: false })
    }

    default:
      return state
  }
}
export default session
