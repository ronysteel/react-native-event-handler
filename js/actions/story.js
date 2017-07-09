// @flow

import type { Action, ThunkAction } from './types'
import { getAllScript } from '../reducers/scripts'

const host: string = 'http://localhost:8080'

const successLoadStories = json => {
  return {
    type: 'LOAD_STORIES_SUCCESS',
    stories: json.response,
  }
}

export function loadStories(): ThunkAction {
  return dispatch => {
    return fetch(`${host}/v1/stories`)
      .then(res => res.json())
      .then(json => {
        if (json.meta.statusCode != 200) {
          // TODO
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
  return dispatch => {
    return fetch(`${host}/v1/stories/${storyId}/episodes`)
      .then(res => res.json())
      .then(json => {
        if (json.meta.statusCode != 200) {
          // TODO
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
  return dispatch => {
    return fetch(`${host}/v1/episodes/${episodeId}/scripts`)
      .then(res => res.json())
      .then(json => {
        if (json.meta.statusCode != 200) {
          // TODO
        }
        dispatch(successLoadEpisode(episodeId, json))
      })
  }
}

export function updateReadState(
  episodeId: number,
  readIndex: ?number,
): ThunkAction {
  return (dispatch, getState) => {
    const { episodes, scripts } = getState()
    return dispatch({
      type: 'UPDATE_READ_STATE',
      episodeId,
      scripts: getAllScript(episodes[episodeId], scripts),
      readIndex,
    })
  }
}
