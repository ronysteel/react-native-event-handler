// @flow

import { combineReducers } from 'redux'

import episodes from './episodes'
import scripts from './scripts'
import readStates from './readStates'
import shareLinks from './shareLinks'
import session from './session'

export default combineReducers({
  episodes,
  scripts,
  readStates,
  shareLinks,
  session,
})
