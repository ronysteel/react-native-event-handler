// @flow

import type { Action, ThunkAction } from './types'
import { getAllScript } from '../reducers/scripts'
import type { Scripts } from '../reducers/scripts'
import type { Episodes, Episode } from '../reducers/episodes'
import type { Energy } from '../reducers/energy'
import firebase from '../firebase'
import { sendCompleteContentEvent } from '../actions/event'
import { fetchEpisode, fetchEpisodeList, fetchRecommends } from '../api'

const successLoadEpisode = (episodeId: string, json): Action => {
  return {
    type: 'LOAD_EPISODE_SUCCESS',
    episodeId,
    episode: json
  }
}

export function loadEpisode (novelId: string, episodeId: string): ThunkAction {
  return async (dispatch, getState) => {
    dispatch({ type: 'LOAD_EPISODE_REQUEST', episodeId })

    try {
      const episode = await fetchEpisode({ novelId, episodeId })
      dispatch(successLoadEpisode(episodeId, episode))
    } catch (err) {
      dispatch({ type: 'LOAD_EPISODE_FAILED', episodeId })
    }
  }
}

const successLoadRecommends = (categoryId: number, json): Action => {
  return {
    type: 'LOAD_RECOMMENDS_SUCCESS',
    categoryId: categoryId,
    recommends: json
  }
}

export function loadRecommends (categoryId: number): ThunkAction {
  return (dispatch, getState) => {
    return fetchRecommends({ categoryId }).then(v => {
      dispatch(successLoadRecommends(categoryId, v))
    })
  }
}

const successLoadEpisodeList = (novelId: string, json): Action => {
  return {
    type: 'LOAD_EPISODE_LIST_SUCCESS',
    novelId: novelId,
    episodes: json
  }
}

export function loadEpisodeList (novelId: string): ThunkAction {
  return (dispatch, getState) => {
    const { novels } = getState()
    const novel = novels[novelId]

    if (novel && !novel.isLoadingEpisodeList && !novel.isLoadedEpisodeList) {
      dispatch({
        type: 'LOAD_EPISODE_LIST_REQUEST',
        novelId
      })

      return fetchEpisodeList({ novelId }).then(v =>
        dispatch(successLoadEpisodeList(novelId, v))
      )
    }

    return new Promise(resolve => resolve())
  }
}

const successUpdateReadState = (
  episodes: Episodes,
  episodeId: string,
  scripts: Scripts,
  readIndex: ?number,
  paid: boolean,
  energy: number,
  tutorialEnded: boolean
): Action => {
  return {
    type: 'UPDATE_READ_STATE',
    episodeId,
    scripts: getAllScript(episodes[episodeId], scripts),
    readIndex,
    paid,
    energy,
    tutorialEnded
  }
}

export function updateReadState (
  episodeId: string,
  readIndex: ?number
): ThunkAction {
  return (dispatch, getState) => {
    const { episodes, scripts, session, energy } = getState()
    return new Promise(resolve => {
      resolve(
        dispatch(
          successUpdateReadState(
            episodes,
            episodeId,
            scripts,
            readIndex,
            session.paid,
            energy.energy,
            session.tutorialEnded
          )
        )
      )
    })
  }
}

const successPageView = () => ({
  type: 'UPDATE_PAGE_VIEW'
})

export function pageView (novelId: string, episodeId: string): ThunkAction {
  return (dispatch, getState) => {
    const { session } = getState()

    return firebase
      .database()
      .ref(`/novels/${novelId}/episodes/${episodeId}/views/${session.uid}`)
      .set(true)
      .then(() => {
        dispatch(successPageView())
      })
  }
}

const completePageView = (): Action => ({
  type: 'FINISH_READING_NOVEL'
})

export function completeContent (episodeId: string): ThunkAction {
  return (dispatch, getState) => {
    const { readStates } = getState()

    if (!readStates[episodeId]) {
      return new Promise(resolve => resolve())
    }

    if (!readStates[episodeId].reachEndOfContent) {
      return new Promise(resolve => resolve())
    }

    return new Promise(resolve => resolve())
      .then(() => {
        dispatch(sendCompleteContentEvent(episodeId))
      })
      .then(() => {
        dispatch(completePageView())
      })
  }
}
