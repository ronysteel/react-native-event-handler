// @flow
import type { Action } from '../actions/types'

export type Energy = {
  isLoaded: boolean,
  isLoading: boolean,
  energy: number,
  latestSyncedEnergy: number,
  latestSyncedAt: ?number,
  nextRechargeDate: ?number
}

const initialStates: Energy = {
  energy: 0,
  latestSyncedEnergy: 0,
  latestSyncedAt: undefined,
  nextRechargeDate: undefined,
  isLoading: false,
  isLoaded: false
}

function energy (state: Energy = initialStates, action: Action): Energy {
  switch (action.type) {
    case 'APPLICATION_STARTUP': {
      return {
        ...state,
        isLoading: false // #340
      }
    }

    case 'SYNC_USER_ENERGY_REQUEST': {
      return {
        ...state,
        isLoading: true
      }
    }

    case 'SYNC_USER_ENERGY_SUCCESS': {
      return Object.assign({}, state, {
        energy: action.energy,
        latestSyncedEnergy: action.energy,
        latestSyncedAt: action.latestSyncedAt,
        nextRechargeDate: action.nextRechargeDate,
        isLoading: false,
        isLoaded: true
      })
    }

    case 'SYNC_USER_ENERGY_FAILED': {
      return {
        ...state,
        isLoading: false
      }
    }

    case 'DECREASE_USER_ENERGY_SUCCESS': {
      const { amount } = action
      const num = amount || 1
      let energy = state.energy - num
      if (energy < 0) {
        energy = 0
      }
      return Object.assign({}, state, { energy })
    }

    case 'INCREASE_USER_ENERGY_SUCCESS': {
      const { amount } = action
      const num = amount || 1
      return Object.assign({}, state, {
        energy: state.energy + num
      })
    }

    default: {
      return state
    }
  }
}
export default energy
