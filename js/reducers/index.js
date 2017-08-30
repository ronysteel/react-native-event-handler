// @flow

import { combineReducers } from 'redux'

import novels from './novels'
import episodes from './episodes'
import scripts from './scripts'
import readStates from './readStates'
import shareLinks from './shareLinks'
import recommends from './recommends'
import session from './session'
import review from './review'
import energy from './energy'
import tickets from './tickets'
import tweets from './tweets'
import tabs from './tabs'
import characters from './characters'
import categories from './categories'
import tutorial from './tutorial'
import purchasingProducts from './purchasingProducts'
import actionLog from './actionLog'
import homePageState from './homePageState'
import storyPageStates from './storyPageStates'
import navigator from './navigator'

export default combineReducers({
  novels,
  episodes,
  scripts,
  readStates,
  shareLinks,
  recommends,
  session,
  review,
  energy,
  tickets,
  tweets,
  tabs,
  characters,
  categories,
  purchasingProducts,
  actionLog,
  tutorial,
  navigator,

  pages: combineReducers({
    homePageState,
    storyPageStates,
  }),
})
