// @flow
import type { Action, ThunkAction } from './types'
import firebase from '../firebase'

export function sendTutorialBeginEvent(): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() => (
        firebase.analytics().logEvent('tutorial_begin')
      ))
      .catch(() => {})
  }
}

export function sendTutorialCompleteEvent(): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() => (
        firebase.analytics().logEvent('tutorial_complete')
      ))
      .catch(() => {})
  }
}

export function sendSelectContentEvent(novelId: number, episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    const { novels, episodes, actionLog } = getState()

    return new Promise(resolve => resolve())
      .then(() => {
        const novel = novels[novelId]
        const episode = episodes[episodeId]

        firebase.analytics().logEvent('select_content', {
          item_id: novelId,
          content_type: 'novel',

          title: novel.title,
          category: novel.categoryId,
          episode: episode.episodeOrder,

          referer: actionLog.type.toLowerCase(),
          referer_section: actionLog.position.sectionIndex,
          referer_position: actionLog.position.positionIndex,
        })
      })
      .catch(() => {})
  }
}

export function sendLeaveContentEvent(episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    const { episodes, readStates } = getState()
    if (readStates[episodeId] && readStates[episodeId].reachEndOfContent) {
      return new Promise(resolve => resolve())
    }

    return new Promise(resolve => resolve())
      .then(() => (
        firebase.analytics().logEvent('leave_content', {
          item_id: episodeId,
          content_type: 'novel',
          script_id: readStates[episodeId].readIndex,
        })
      ))
      .catch(() => {})
  }
}

export function sendPromotionEvent(episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() => (
        firebase.analytics().logEvent('promotion', {
          item_id: episodeId,
          content_type: 'novel',
        })
      ))
      .catch(() => {})
  }
}
