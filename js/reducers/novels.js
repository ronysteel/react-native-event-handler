// @flow
import type { Action } from '../actions/types'
import type { Script } from './scripts'

export type Novel = {
  novelId: number,
  title: string,
  categoryId: number,
  episodeIds: Array<number>,
  thumbnailUrl: string,
  isLoadingEpisodeList: boolean,
  isLoadedEpisodeList: boolean
}

export type Novels = {
  [novelId: number]: Novel
}

const initialStates: Novel = {}

function novels (state: Novels = initialStates, action: Action): Novels {
  switch (action.type) {
    case 'LOAD_EPISODE_SUCCESS': {
      const { novelId, metadata } = action.episode
      const s = Object.assign({}, state[novelId] || {}, {
        novelId: novelId,
        title: metadata.title,
        categoryId: metadata.categoryId,
        thumbnailUrl: metadata.thumbnailUrl,

        // サーバーサイドでキャッシュ機構準備するまで
        // ノベル読み始めまえにEpisodeListのisLoadedフラグをリセットする
        isLoadingEpisodeList: false,
        isLoadedEpisodeList: false
      })
      return Object.assign({}, state, { [novelId]: s })
    }

    case 'LOAD_EPISODE_LIST_REQUEST': {
      const { novelId } = action
      if (!state[novelId]) {
        return state
      }
      const s = {
        ...state[novelId],
        isLoadingEpisodeList: true
      }
      return { ...state, [novelId]: s }
    }

    case 'LOAD_EPISODE_LIST_SUCCESS': {
      const { novelId, episodes } = action
      if (!state[novelId]) {
        return state
      }
      const s = {
        ...state[novelId],
        episodeIds: Object.keys(episodes)
          .sort((a, b) => episodes[a].episodeOrder - episodes[b].episodeOrder)
          // APIのバグでepisodeIdがlower caseになっていたので
          // クライアント側でもしばらく対応
          // https://github.com/newn-team/chatnovel-server/commit/c280516f139006b1fdb92b7af4613bd8d886dad2
          .map(v => v.toUpperCase()),
        isLoadingEpisodeList: false,
        isLoadedEpisodeList: true
      }
      return { ...state, [novelId]: s }
    }

    default:
      return state
  }
}

export default novels
