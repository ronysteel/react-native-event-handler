// @flow
import type { Action, ThunkAction } from './types'
import firebase from '../firebase'

export function sentTutorialBeginEvent(): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() => (
        firebase.analytics().logEvent('tutorial_begin')
      ))
  }
}

export function sentTutorialCompleteEvent(): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() => (
        firebase.analytics().logEvent('tutorial_complete')
      ))
  }
}

export function sentSelectContentEvent(novelId: number, episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    const { novels, episodes } = getState()
    const novel = novels[novelId]
    const episode = episodes[episodeId]

    return new Promise(resolve => resolve())
      .then(() => (
        firebase.analytics().logEvent('select_content', {
          item_id: novelId,
          content_type: 'novel',

          title: novel.title,
          category: novel.categoryId,
          episode: episode.episodeOrder,

          // TODO
          referer: '',
          referer_section: 0,
          referer_position: 0,
        })
      ))
  }
}
