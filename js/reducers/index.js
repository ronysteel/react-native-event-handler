// @flow

import { combineReducers } from 'redux'

import novels from './novels'
import episodes from './episodes'
import scripts from './scripts'
import readStates from './readStates'
import shareLinks from './shareLinks'
import recommends from './recommends'
import session from './session'
import energy from './energy'
import tickets from './tickets'
import tabs from './tabs'
import characters from './characters'
import purchasingProducts from './purchasingProducts'
import homePageState from './homePageState'
import storyPageStates from './storyPageStates'

export default combineReducers({
  novels,
  episodes,
  scripts,
  readStates,
  shareLinks,
  recommends,
  session,
  energy,
  tickets,
  tabs,
  characters,
  purchasingProducts,

  pages: combineReducers({
    homePageState,
    storyPageStates,
  }),
})
