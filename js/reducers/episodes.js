// @flow
import type { Action } from '../actions/types'

export type Episode = {
  id: number;
  title: string;
  description: string;
  scriptIds: Array<number>;
}

export type Episodes = {
  [id: number]: Episode;
}

const initialStates: Episodes = {}

function episodes(state: Episodes = initialStates, action: Action): Episodes {
  switch (action.type) {
    case 'LOAD_STORY_SUCCESS':
      if (!action.story.episodes) {
        return state
      }

      const episodes = action.story.episodes.reduce((memo, v) => {
        memo[v.episode.id] = v.episode
        memo[v.episode.id].scriptIds = []
        return memo
      }, {})
      return Object.assign({}, state, episodes)

    case 'LOAD_EPISODE_SUCCESS':
      const episodeId = action.episode.id
      const scriptIds = (episode => {
        if (episode.scripts) {
          return episode.scripts.map(v => v.script.id)
        }
        return []
      })(action.episode)

      const episode = state[episodeId]
      episode.scriptIds = scriptIds
      return Object.assign({}, state, { [episodeId]: episode })

    default:
      return state
  }
}

export default episodes
