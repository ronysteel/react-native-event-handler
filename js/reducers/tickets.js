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

    case 'USE_TICKET_REQUEST': {
      return state
    }

    case 'USE_TICKET_SUCCESS': {
      return state
    }

    case 'USE_TICKET_FAILED': {
      return state
    }

    case 'GET_TICKET_REQUEST': {
      return state
    }

    case 'GET_TICKET_SUCCESS': {
      return state
    }

    case 'GET_TICKET_FAILED': {
      return state
    }

    default: {
      return state
    }
  }
}
export default tickets
