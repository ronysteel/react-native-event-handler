// @flow
import type { Action, ThunkAction } from './types'
import { StatusBar } from 'react-native'

export function closePromotionModal(episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    return (new Promise(resolve => resolve()))
      .then(() => {
        StatusBar.setBarStyle('light-content')
        StatusBar.setHidden(true)
      })
      .then(() => (
        dispatch({
          type: 'CLOSE_STORY_PAGE_PROMOTION_MODAL_SUCCESS',
          episodeId,
        })
      ))
  }
}

export function openPromotionModal(episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    const { session, readStates } = getState()

    if (session.paid) {
      return (new Promise(resolve => resolve()))
    }

    if (!readStates[episodeId].displayPromotion) {
      return (new Promise(resolve => resolve()))
    }

    return (new Promise(resolve => resolve()))
      .then(() => {
        StatusBar.setBarStyle('dark-content')
        StatusBar.setHidden(false, true)
      })
      .then(() => (
        dispatch({
          type: 'OPEN_STORY_PAGE_PROMOTION_MODAL_SUCCESS',
          episodeId,
        })
      ))
  }
}

export function closeEpisodeListModal(episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    return (new Promise(resolve => resolve()))
      .then(() => {
        StatusBar.setBarStyle('light-content')
        StatusBar.setHidden(true)
      })
      .then(() => (
        dispatch({
          type: 'CLOSE_STORY_PAGE_EPISODE_LIST_MODAL_SUCCESS',
          episodeId,
        })
      ))
  }
}

export function openEpisodeListModal(episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    return (new Promise(resolve => resolve()))
      .then(() => {
        StatusBar.setBarStyle('light-content')
        StatusBar.setHidden(false, true)
      })
      .then(() => (
        dispatch({
          type: 'OPEN_STORY_PAGE_EPISODE_LIST_MODAL_SUCCESS',
          episodeId,
        })
      ))
  }
}
