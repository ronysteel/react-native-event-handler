// @flow
import type { Action } from '../actions/types'
import type { Novel } from './novels'

export type Episode = {
  id: string,
  title: string,
  description: string,
  episodeOrder: number,
  theme: string,
  novelId: string,
  scriptIds: Array<number>,
  isLoading: boolean,
  isLoaded: boolean
}

export type Episodes = {
  [id: string]: Episode
}

const initialState: Episode = {
  id: '',
  title: '',
  description: '',
  episodeOrder: 0,
  theme: 'dark',
  novelId: '',
  scriptIds: [],
  isLoading: false,
  isLoaded: false
}
const initialStates: Episodes = {}

function episodes (state: Episodes = initialStates, action: Action): Episodes {
  switch (action.type) {
    case 'LOAD_EPISODE_REQUEST': {
      const episodeId = action.episodeId
      const episode = {
        ...(state[episodeId] || initialState),
        isLoading: true
      }
      return { ...state, [episodeId]: episode }
    }

    case 'LOAD_EPISODE_FAILED': {
      const episodeId = action.episodeId
      const episode = {
        ...(state[episodeId] || initialState),
        isLoading: false
      }
      return { ...state, [episodeId]: episode }
    }

    case 'LOAD_EPISODE_SUCCESS': {
      const episodeId = action.episodeId
      const scriptIds = (episode => {
        if (episode.scripts) {
          // $FlowFixMe
          return Object.values(episode.scripts).map(v => v.script.id)
        }
        return []
      })(action.episode)

      const episode = {
        ...(state[episodeId] || initialState),
        ...action.episode.episode,
        id: episodeId,
        scriptIds,
        isLoading: false,
        isLoaded: true
      }
      return { ...state, [episodeId]: episode }
    }

    case 'LOAD_EPISODE_LIST_SUCCESS': {
      const { novelId, episodes } = action
      // APIのバグでepisodeIdがlower caseになっていたので
      // クライアント側でもしばらく対応
      // https://github.com/newn-team/chatnovel-server/commit/c280516f139006b1fdb92b7af4613bd8d886dad2
      const _episodes = Object.keys(episodes).reduce((memo, k) => {
        memo[k.toUpperCase()] = {
          ...(state[k.toUpperCase()] || {}),
          ...episodes[k]
        }
        return memo
      }, {})
      return { ...state, ..._episodes }
    }

    default:
      return state
  }
}

export const getAllEpisode = (
  novel: Novel,
  episodes: Array<Episode>
): Array<Episode> => {
  if (!novel || !novel.episodeIds) {
    return []
  }

  return novel.episodeIds.reduce((memo, id) => {
    memo.push(episodes[id])
    return memo
  }, [])
}

export const getNextEpisode = (
  novel: Novel,
  currentEpisode: Episode,
  episodes: Array<Episode>
): ?Episode => {
  if (!novel || !novel.episodeIds) {
    return null
  }

  const index = novel.episodeIds.findIndex(v => v === currentEpisode.id)

  if (index < 0) {
    return null
  }

  if (index >= novel.episodeIds.length - 1) {
    return null
  }

  const nextEpisodeId = novel.episodeIds[index + 1]
  return episodes[nextEpisodeId]
}

export default episodes
