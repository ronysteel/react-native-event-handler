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
  fetchRecommends,
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
    return fetchEpisode({ novelId, episodeId })
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
    return fetchRecommends({ categoryId })
      .then(v => {
        dispatch(successLoadRecommends(categoryId, v))
      })
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
    return fetchEpisodeList({ novelId })
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
  tutorialEnded: boolean,
): Action => {
  return {
    type: 'UPDATE_READ_STATE',
    episodeId,
    scripts: getAllScript(episodes[episodeId], scripts),
    readIndex,
    paid,
    energy,
    tutorialEnded,
  }
}

export function updateReadState(
  episodeId: number,
  readIndex: ?number,
): ThunkAction {
  return (dispatch, getState) => {
    const { episodes, scripts, session, energy } = getState()
    return new Promise(resolve => {
      resolve(dispatch(successUpdateReadState(
        episodes,
        episodeId,
        scripts,
        readIndex,
        session.paid,
        energy.energy,
        session.tutorialEnded
      )))
    })
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
