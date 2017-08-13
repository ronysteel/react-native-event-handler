// @flow
import type { Action } from '../actions/types'

export type Session = {
  uid: ?string;
  paid: boolean;
  paidAccountExpiresDate: ?number;
  tutorialEnded: boolean;
}

const initialStates: Session = {
  uid: undefined,
  paid: false,
  paidAccountExpiresDate: null,
  tutorialEnded: false,
}

function session(state: Session = initialStates, action: Action): Session {
  switch (action.type) {
    case 'SIGN_IN_ANONYMOUSLY_REQUEST': {
      return state
    }

    case 'SIGN_IN_ANONYMOUSLY_SUCCESS': {
      const { user } = action
      let expiresDate = user.paidAccountExpiresDate
      if (!expiresDate) expiresDate = null

      return Object.assign({}, state, {
        uid: user.uid,
        paid: user.paid,
        paidAccountExpiresDate: expiresDate,
      })
    }

    case 'PURCHASE_SUCCESS': {
      const { expiresDate } = action
      return { ...state, paid: true, paidAccountExpiresDate: expiresDate }
    }

    case 'PURCHASE_FAILED': {
      return { ...state, paid: false, paidAccountExpiresDate: null }
    }

    case 'RESTORE_PURCHASE_SUCCESS': {
      const { expiresDate } = action
      return { ...state, paid: true, paidAccountExpiresDate: expiresDate }
    }

    case 'RESTORE_PURCHASE_FAILED': {
      return { ...state, paid: false, paidAccountExpiresDate: null }
    }

    case 'TUTORIAL_END_SUCCESS': {
      return Object.assign({}, state, { tutorialEnded: true })
    }

    default:
      return state
  }
}
export default session
