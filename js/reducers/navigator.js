// @flow
import type { Action } from '../actions/types'
import { Navigator } from '../containers/Router'

export type Nav = any;

const firstAction = Navigator.router.getActionForPathAndParams('Home')
const initialState: Nav = Navigator.router.getStateForAction(firstAction)

function navigator(state: Nav = initialState, action: Action): Nav {
  const nextState = Navigator.router.getStateForAction(action, state)
  return nextState || state
}

export default navigator
