// @flow

import { combineReducers } from 'redux'

import stories from './stories'
import episodes from './episodes'
import scripts from './scripts'
import readStates from './readStates'

export default combineReducers({
  stories,
  episodes,
  scripts,
  readStates,
})
