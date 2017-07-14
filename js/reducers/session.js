// @flow
import type { Action } from '../actions/types'

export type Session = {
  uid: ?string;
}

const initialStates: Session = { uid: undefined }

function session(state: Session = initialStates, action: Action): Session {
  switch (action.type) {
    case 'SIGN_IN_ANONYMOUSLY_SUCCESS':
      const { user } = action
      return {
        uid: user.uid
      }

    default:
      return state
  }
}
export default session
