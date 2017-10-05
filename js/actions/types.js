// @flow

export type Action =
  // app
  | { type: 'APPLICATION_STARTUP' }
  | { type: 'LOAD_PURCHASING_PRODUCT_REQUEST' }
  | { type: 'LOAD_PURCHASING_PRODUCT_FAILED' }
  | { type: 'LOAD_PURCHASING_PRODUCT_SUCCESS', products: any }
  | { type: 'LOAD_TAB_REQUEST', tabName: string }
  | { type: 'LOAD_TAB_SUCCESS', tabName: string, tab: any }
  | { type: 'LOAD_TAB_FAILED', tabName: string }
  | { type: 'LOAD_AVAILABLE_TABS_REQUEST' }
  | { type: 'LOAD_AVAILABLE_TABS_SUCCESS', tabNames: string }
  | { type: 'LOAD_AVAILABLE_TABS_FAILED' }
  | { type: 'MOVE_SCREEN_SUCCESS', screenType: any, params: any }
  | {
    type: 'SELECT_CONTENT_SUCCESS',
    sectionIndex: string,
    positionIndex: number
  }
  | { type: 'LOAD_CATEGORIES_SUCCESS', categories: any }
  | { type: 'LOAD_TICKET_COUNT_SUCCESS', ticketCount: number }
  | { type: 'LOAD_TUTORIAL_REQUEST' }
  | { type: 'LOAD_TUTORIAL_SUCCESS', novelId: string, episodeId: string }
  | { type: 'SETUP_REVIEW_STATUS', currentVersion: string }
  | { type: 'FINISH_REQUEST_REVIEW' }

  // story
  | {
    type: 'UPDATE_READ_STATE',
    episodeId: string,
    scripts: any,
    readIndex: ?number
  }
  | { type: 'UPDATE_PAGE_VIEW' }
  | { type: 'LOAD_EPISODE_REQUEST', episodeId: string }
  | {
    type: 'LOAD_EPISODE_SUCCESS',
    episode: { id: string, scripts: Array<Object> }
  }
  | { type: 'LOAD_EPISODE_FAILED', episodeId: string }
  | {
    type: 'LOAD_RECOMMENDS_SUCCESS',
    categoryId: number,
    recommends: any
  }
  | {
    type: 'LOAD_EPISODE_LIST_SUCCESS',
    novelId: string,
    episodes: Array<any>
  }
  | { type: 'LOAD_EPISODE_LIST_REQUEST', novelId: string }
  | { type: 'FINISH_READING_NOVEL' }

  // user
  | { type: 'RESTORE_PURCHASE_SUCCESS', expiresDate: number }
  | { type: 'RESTORE_PURCHASE_FAILED' }
  | { type: 'DECREASE_USER_ENERGY_SUCCESS', userId: string, amount: ?number }
  | { type: 'SYNC_USER_ENERGY_REQUEST' }
  | { type: 'SYNC_USER_ENERGY_FAILED' }
  | {
    type: 'SYNC_USER_ENERGY_SUCCESS',
    energy: number,
    latestSyncedAt: number,
    nextRechargeDate: number,
    ticketCount: number,
    remainingTweetCount: number
  }
  | { type: 'USE_TICKET_REQUEST' }
  | { type: 'USE_TICKET_SUCCESS' }
  | { type: 'USE_TICKET_FAILED' }
  | { type: 'GET_TICKET_REQUEST' }
  | { type: 'GET_TICKET_SUCCESS' }
  | { type: 'GET_TICKET_FAILED' }
  | { type: 'TUTORIAL_END_SUCCESS' }
  | { type: 'SIGN_IN_ANONYMOUSLY_REQUEST' }
  | { type: 'SIGN_IN_ANONYMOUSLY_SUCCESS', user: any }
  | { type: 'PURCHASE_SUCCESS' }
  | { type: 'PURCHASE_FAILED' }

  // homePage
  | { type: 'CLOSE_HOME_PAGE_SETTING_MODAL_SUCCESS' }
  | { type: 'OPEN_HOME_PAGE_SETTING_MODAL_SUCCESS' }

  // storyPage
  | { type: 'CLOSE_STORY_PAGE_PROMOTION_MODAL_SUCCESS', episodeId: string }
  | { type: 'OPEN_STORY_PAGE_PROMOTION_MODAL_SUCCESS', episodeId: string }
  | { type: 'CLOSE_STORY_PAGE_EPISODE_LIST_MODAL_SUCCESS', episodeId: string }
  | { type: 'OPEN_STORY_PAGE_EPISODE_LIST_MODAL_SUCCESS', episodeId: string }

export type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any
export type GetState = () => Object
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any
export type PromiseAction = Promise<Action>
