// @flow
import type { Action } from '../actions/types'

export type Episode = {
  id: number,
  title: string,
  description: string,
  episodeOrder: number,
  theme: string,
  novelId: number,
  scriptIds: Array<number>
}

export type Episodes = {
  [id: number]: Episode
}

const initialStates: Episodes = {}

function episodes (state: Episodes = initialStates, action: Action): Episodes {
  switch (action.type) {
    case 'LOAD_EPISODE_SUCCESS': {
      const episodeId = action.episodeId
      const scriptIds = (episode => {
        if (episode.scripts) {
          return Object.values(episode.scripts).map(v => v.script.id)
        }
        return []
      })(action.episode)

      const episode = {
        ...(state[episodeId] || {}),
        ...action.episode.episode,
        id: episodeId,
        scriptIds
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

export const getAllEpisode = (novel, episodes): Array<Episode> => {
  if (!novel || !novel.episodeIds) {
    return []
  }

  return novel.episodeIds.reduce((memo, id) => {
    memo.push(episodes[id])
    return memo
  }, [])
}

export const getNextEpisode = (
  novel,
  currentEpisode: Episode,
  episodes: Episodes
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
