// @flow
import type { Action, ThunkAction } from './types'
import firebase from '../firebase'

export function sentTutorialBeginEvent(): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() => (
        firebase.analytics().logEvent('tutorial_begin')
      ))
      .catch(() => {})
  }
}

export function sentTutorialCompleteEvent(): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() => (
        firebase.analytics().logEvent('tutorial_complete')
      ))
      .catch(() => {})
  }
}

export function sentSelectContentEvent(novelId: number, episodeId: number): ThunkAction {
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
      ))
  }
}
