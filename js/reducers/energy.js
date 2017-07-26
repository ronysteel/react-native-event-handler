// @flow
import type { Action } from '../actions/types'

export type Energy = {
  energy: number;
}

const initialStates: Energy = {
  energy: 0,
}

function energy(state: Energy = initialStates, action: Action): Energy {
  switch (action.type) {
    case 'LOAD_USER_ENERGY_REQUEST': {
      return Object.assign({}, initialStates)
    }

    case 'LOAD_USER_ENERGY_SUCCESS': {
      return Object.assign({}, state, {
        energy: action.userEnergy.energy,
      })
    }

    default: {
      return state
    }
  }
}
export default energy
