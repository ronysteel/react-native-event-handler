// @flow
import type { Action, ThunkAction } from './types'
import { NativeModules } from 'react-native'
const { InAppUtils } = NativeModules
import {
  fetchCategories,
  fetchTicketCount,
  fetchTab,
  fetchAvailableTabs,
  fetchTutorial
} from '../api'
import DeviceInfo from 'react-native-device-info'

import { sendLeaveContentEvent } from './event'

export function applicationStartup (): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve()).then(() =>
      dispatch({ type: 'APPLICATION_STARTUP' })
    )
  }
}

export function loadPurcasingProducts (): ThunkAction {
  const products = ['co.newn.chatnovel.oneweek', 'co.newn.chatnovel.onemonth']

  return (dispatch, getState) => {
    dispatch({
      type: 'LOAD_PURCHASING_PRODUCT_REQUEST'
    })

    return new Promise(resolve => resolve()).then(() => {
      InAppUtils.loadProducts(products, (err, products) => {
        if (err) {
          return dispatch({
            type: 'LOAD_PURCHASING_PRODUCT_FAILED'
          })
        }

        dispatch({
          type: 'LOAD_PURCHASING_PRODUCT_SUCCESS',
          products
        })
      })
    })
  }
}

export function loadTab (tabName: string = 'home'): ThunkAction {
  return async (dispatch, getState) => {
    dispatch({ type: 'LOAD_TAB_REQUEST', tabName })

    try {
      const tab = await fetchTab({ tabName: tabName })
      dispatch({
        type: 'LOAD_TAB_SUCCESS',
        tabName,
        tab
      })
    } catch (err) {
      dispatch({ type: 'LOAD_TAB_FAILED', tabName })
    }
  }
}

export function loadAvailableTabs (): ThunkAction {
  return async (dispatch, getState) => {
    dispatch({ type: 'LOAD_AVAILABLE_TABS_REQUEST' })
    try {
      const v = await fetchAvailableTabs()
      dispatch({
        type: 'LOAD_AVAILABLE_TABS_SUCCESS',
        tabNames: v.availableList
      })

      await Promise.all(v.availableList.map(v => dispatch(loadTab(v))))
    } catch (err) {
      dispatch({ type: 'LOAD_AVAILABLE_TABS_FAILED' })
    }
  }
}

export function moveScreen (screenType: string, params: ?any = {}): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() => {
        return dispatch({
          type: 'MOVE_SCREEN_SUCCESS',
          screenType,
          params
        })
      })
      .then(() => {
        const { actionLog } = getState()
        const { prevScreen, currentScreen } = actionLog
        if (prevScreen.type != 'NOVEL') {
          return
        }
        dispatch(sendLeaveContentEvent(prevScreen.novel.episodeId))
      })
  }
}

export function selectContent (
  sectionIndex: string,
  positionIndex: number
): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve()).then(() => {
      return dispatch({
        type: 'SELECT_CONTENT_SUCCESS',
        sectionIndex,
        positionIndex
      })
    })
  }
}

export function loadCategories (): ThunkAction {
  return (dispatch, getState) => {
    return fetchCategories().then(v => {
      return dispatch({
        type: 'LOAD_CATEGORIES_SUCCESS',
        categories: v
      })
    })
  }
}

export function loadTicketCount (): ThunkAction {
  return (dispatch, getState) => {
    const { session } = getState()
    return fetchTicketCount(session).then(v => {
      return dispatch({
        type: 'LOAD_TICKET_COUNT_SUCCESS',
        ticketCount: v
      })
    })
  }
}

export function loadTutorial (): ThunkAction {
  return (dispatch, getState) => {
    dispatch({ type: 'LOAD_TUTORIAL_REQUEST' })

    return fetchTutorial().then(v =>
      dispatch({
        type: 'LOAD_TUTORIAL_SUCCESS',
        novelId: v.novelId,
        episodeId: v.episodeId
      })
    )
  }
}

export function setupReviewStatus (): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve()).then(() => {
      return dispatch({
        type: 'SETUP_REVIEW_STATUS',
        currentVersion: DeviceInfo.getVersion()
      })
    })
  }
}

export function finishRequestReview (): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve()).then(() =>
      dispatch({ type: 'FINISH_REQUEST_REVIEW' })
    )
  }
}
