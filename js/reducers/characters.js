// @flow
import type { Action } from '../actions/types'
import type { Script } from './scripts'

export type Character = {
  name: string,
  color: string,
  avatarUrl: string
}

export type Characters = {
  [characterId: number]: Character
}

export type EpisodeCharacters = {
  [episodeId: number]: Characters
}

const initialStates: EpisodeCharacters = {}

function characters (
  state: EpisodeCharacters = initialStates,
  action: Action
): EpisodeCharacters {
  switch (action.type) {
    case 'LOAD_EPISODE_SUCCESS': {
      const { episodeId, episode } = action
      const characters = episode.characters

      return Object.assign({}, state, { [episodeId]: characters })
    }
    default:
      return state
  }
}

export default characters
