// @flow

import { combineReducers } from 'redux'

import stories from './stories'
import episodes from './episodes'
import scripts from './scripts'
import readStates from './readStates'
import session from './session'

export default combineReducers({
  stories,
  episodes,
  scripts,
  readStates,
  session,
})
