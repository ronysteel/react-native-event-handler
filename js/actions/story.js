// @flow

import type { Action, ThunkAction } from './types'
import { getAllScript } from '../reducers/scripts'
import type { Scripts } from '../reducers/scripts'
import type { Episodes, Episode } from '../reducers/episodes'
import firebase from '../firebase'

const successLoadEpisode = (episodeId: number, json) => {
  return {
    type: 'LOAD_EPISODE_SUCCESS',
    episode: {
      id: episodeId,
      scripts: json,
    },
  }
}

export function loadEpisode(novelId: number, episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    return firebase.database()
      .ref(`/scripts/${episodeId}/scripts`)
      .once('value').then((snapshot) => {
        dispatch(successLoadEpisode(episodeId, snapshot.val()))
      })
  }
}

const successUpdateReadState = (
  episodes: Episodes,
  episodeId: number,
  scripts: Scripts,
  readIndex: ?number,
  paid: boolean,
): Action => {
  return {
    type: 'UPDATE_READ_STATE',
    episodeId,
    scripts: getAllScript(episodes[episodeId], scripts),
    readIndex,
    paid,
  }
}

export function updateReadState(
  episodeId: number,
  readIndex: ?number,
): ThunkAction {
  return (dispatch, getState) => {
    const { episodes, scripts, session } = getState()
    return dispatch(successUpdateReadState(episodes, episodeId, scripts, readIndex, session.paid))
  }
}

const successPageView = () => ({
  type: 'UPDATE_PAGE_VIEW'
})

export function pageView(novelId: number, episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    const { session } = getState()

    return firebase.database()
      .ref(`/novels/${novelId}/episodes/${episodeId}/views/${session.uid}`)
      .set(true)
      .then(() => {
        dispatch(successPageView())
      })
  }
}
