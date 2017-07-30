// @flow
import type { Action } from '../actions/types'

export type Tickets = {
  ticketCount: number;
}

const initialStates: Tickets = {
  ticketCount: 0,
}

function tickets(state: Tickets = initialStates, action: Action): Tickets {
  switch (action.type) {
    case 'SYNC_USER_ENERGY_SUCCESS': {
      return Object.assign({}, state, {
        ticketCount: action.ticketCount,
      })
    }

    default: {
      return state
    }
  }
}
export default tickets

