// @flow

import type { Action, ThunkAction } from './types'
import { getAllScript } from '../reducers/scripts'
import type { Scripts } from '../reducers/scripts'
import type { Episodes, Episode } from '../reducers/episodes'
import firebase from '../firebase'

const host: string = 'http://localhost:8080'
const getRequestOptions = ({ session }) => {
  return {
    headers: {
      'Authorization': `BEARER ${session.idToken}`,
    }
  }
}

const successLoadStories = json => {
  return {
    type: 'LOAD_STORIES_SUCCESS',
    stories: json.response,
  }
}

export function loadStories(): ThunkAction {
  return (dispatch, getState) => {
    return fetch(`${host}/v1/stories`, getRequestOptions(getState()))
      .then(res => res.json())
      .then(json => {
        if (json.meta.statusCode != 200) {
          // TODO
          return
        }
        dispatch(successLoadStories(json))
      })
  }
}

const successLoadStory = (storyId: number, json) => {
  return {
    type: 'LOAD_STORY_SUCCESS',
    story: {
      id: storyId,
      episodes: json.response
    },
  }
}

export function loadStory(storyId: number): ThunkAction {
  return (dispatch, getState) => {
    return fetch(`${host}/v1/stories/${storyId}/episodes`, getRequestOptions(getState()))
      .then(res => res.json())
      .then(json => {
        if (json.meta.statusCode != 200) {
          // TODO
          return
        }
        dispatch(successLoadStory(storyId, json))
      })
  }
}

const successLoadEpisode = (episodeId: number, json) => {
  return {
    type: 'LOAD_EPISODE_SUCCESS',
    episode: {
      id: episodeId,
      scripts: json.response,
    },
  }
}

export function loadEpisode(episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    return fetch(`${host}/v1/episodes/${episodeId}/scripts`, getRequestOptions(getState()))
      .then(res => res.json())
      .then(json => {
        if (json.meta.statusCode != 200) {
          // TODO
          return
        }
        dispatch(successLoadEpisode(episodeId, json))
      })
  }
}

const successUpdateReadState = (
  episodes: Episodes,
  episodeId: number,
  scripts: Scripts,
  readIndex: ?number,
): Action => {
  return {
    type: 'UPDATE_READ_STATE',
    episodeId,
    scripts: getAllScript(episodes[episodeId], scripts),
    readIndex,
  }
}

export function updateReadState(
  episodeId: number,
  readIndex: ?number,
): ThunkAction {
  return (dispatch, getState) => {
    const { episodes, scripts } = getState()
    return dispatch(successUpdateReadState(episodes, episodeId, scripts, readIndex))
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
