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
      .ref(`/scripts/${episodeId}`)
      .once('value').then((snapshot) => {
        dispatch(successLoadEpisode(episodeId, snapshot.val()))
      })
  }
}

const successLoadShareLinks = (episodeId: number, json) => {
  return {
    type: 'LOAD_SHARE_LINKS_SUCCESS',
    episodeId: episodeId,
    links: json,
  }
}

export function loadShareLinks(episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    return firebase.database()
      .ref(`/share_links/${episodeId}`)
      .once('value').then((snapshot) => {
        dispatch(successLoadShareLinks(episodeId, snapshot.val()))
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

const successLoadNovelMetadata = (novelId: number, json) => {
  return {
    type: 'LOAD_NOVEL_METADATA_SUCCESS',
    novelId: novelId,
    metadata: json,
  }
}

export function loadNovelMetadata(novelId: number): ThunkAction {
  return (dispatch, getState) => {
    return firebase.database()
      .ref(`/novels/${novelId}/metadata`)
      .once('value').then((snapshot) => (
        dispatch(successLoadNovelMetadata(novelId, snapshot.val()))
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
    return firebase.database()
      .ref(`/episodes/${novelId}`)
      .once('value').then((snapshot) => {
        if (!snapshot.val()) {
          return Promise.reject()
        }
        return dispatch(successLoadEpisodeList(novelId, snapshot.val()))
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
