// @flow

import type { Action, ThunkAction } from './types'
import { getAllScript } from '../reducers/scripts'
import type { Scripts } from '../reducers/scripts'
import type { Episodes, Episode } from '../reducers/episodes'
import type { Energy } from '../reducers/energy'
import firebase from '../firebase'
import {
  fetchEpisode,
  fetchEpisodeList,
} from '../api'

const successLoadEpisode = (episodeId: number, json) => {
  return {
    type: 'LOAD_EPISODE_SUCCESS',
    episodeId,
    episode: json,
  }
}

export function loadEpisode(novelId: number, episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    const { session } = getState()
    const { idToken } = session
    return fetchEpisode({ idToken, novelId, episodeId })
      .then(v => {
        return dispatch(successLoadEpisode(episodeId, v))
      })
  }
}

const successLoadRecommends = (categoryId: number, json) => {
  return {
    type: 'LOAD_RECOMMENDS_SUCCESS',
    categoryId: categoryId,
    recommends: json,
  }
}

export function loadRecommends(categoryId: number): ThunkAction {
  return (dispatch, getState) => {
    return firebase.database()
      .ref(`/recommends/${categoryId}`)
      .once('value').then((snapshot) => (
        dispatch(successLoadRecommends(categoryId, snapshot.val()))
      ))
  }
}

const successLoadEpisodeList = (novelId: number, json) => {
  return {
    type: 'LOAD_EPISODE_LIST_SUCCESS',
    novelId: novelId,
    episodes: json,
  }
}

export function loadEpisodeList(novelId: number): ThunkAction {
  return (dispatch, getState) => {
    const { session } = getState()
    const { idToken } = session
    return fetchEpisodeList({ idToken, novelId })
      .then(v => dispatch(successLoadEpisodeList(novelId, v)))
  }
}

const successUpdateReadState = (
  episodes: Episodes,
  episodeId: number,
  scripts: Scripts,
  readIndex: ?number,
  paid: boolean,
  energy: number,
): Action => {
  return {
    type: 'UPDATE_READ_STATE',
    episodeId,
    scripts: getAllScript(episodes[episodeId], scripts),
    readIndex,
    paid,
    energy,
  }
}

export function updateReadState(
  episodeId: number,
  readIndex: ?number,
): ThunkAction {
  return (dispatch, getState) => {
    const { episodes, scripts, session, energy } = getState()
    return dispatch(successUpdateReadState(
      episodes, episodeId, scripts, readIndex, session.paid, energy.energy))
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
