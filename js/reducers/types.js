import type * as actionLog from './actionLog'
import type * as categories from './categories'
import type * as characters from './characters'
import type * as energy from './energy'
import type * as episodes from './episodes'
import type * as homePageState from './homePageState'
import type * as novels from './novels'
import type * as purchasingProduct from './purchasingProduct'
import type * as readStates from './readStates'
import type * as recommends from './recommends'
import type * as review from './review'
import type * as scripts from './scripts'
import type * as session from './session'
import type * as shareLinks from './shareLinks'
import type * as storyPageStates from './storyPageStates'
import type * as tabs from './tabs'
import type * as tickets from './tickets'
import type * as tutorial from './tutorial'
import type * as tweets from './tweets'

export type Union = {
  ...actionLog,
  ...categories,
  ...characters,
  ...energy,
  ...episodes,
  ...homePageState,
  ...novels,
  ...purchasingProduct,
  ...readStates,
  ...recommends,
  ...review,
  ...scripts,
  ...session,
  ...shareLinks,
  ...storyPageStates,
  ...tabs,
  ...tickets,
  ...tutorial,
  ...tweets
}
