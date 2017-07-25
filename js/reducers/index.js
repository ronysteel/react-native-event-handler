// @flow

import { combineReducers } from 'redux'

import novels from './novels'
import episodes from './episodes'
import scripts from './scripts'
import readStates from './readStates'
import shareLinks from './shareLinks'
import recommends from './recommends'
import session from './session'

export default combineReducers({
  novels,
  episodes,
  scripts,
  readStates,
  shareLinks,
  recommends,
  session,
})
