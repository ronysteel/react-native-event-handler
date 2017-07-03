// @flow
import type { Action } from '../actions/types'

export type Story = {
  id: number;
  title: string;
  description: string;
  episodeIds: Array<number>;
}

export type Stories = {
  [id: number]: Story;
}

const initialStates: Stories = {}

function stories(state: Stories = initialStates, action: Action): Stories {
  switch (action.type) {
    case 'LOAD_STORIES_SUCCESS':
      const stories = action.stories.reduce((memo, v) => {
        memo[v.story.id] = v.story
        memo[v.story.id].episodeIds = []
        return memo
      }, {})
      return Object.assign({}, state, stories)

    case 'LOAD_STORY_SUCCESS':
      const storyId = action.story.id
      const episodeIds = (story => {
        if (story.episodes) {
          return story.episodes.map(v => v.episode.id)
        }
        return []
      })(action.story)

      const story = state[storyId]
      story.episodeIds = episodeIds
      return Object.assign({}, state, { [storyId]: story })

    default:
      return state
  }
}

export default stories
