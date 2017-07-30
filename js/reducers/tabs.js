// @flow
import type { Action } from '../actions/types'

export type Tabs = {
  [tabName: string]: Tab;
}

type Section = {
  type: string;
  title: string;
  novels: Array<any>;
}

export type Tab = {
  name: string;
  sections: Array<Section>;
  isLoading: boolean;
  isLoaded: boolean;
}

const initialStates: Tabs = {}

function tabs(state: Tabs = initialStates, action: Action): Tabs {
  switch (action.type) {
    case 'LOAD_TAB_REQUEST': {
      const { tabName } = action
      const v = Object.assign({}, state[tabName], {
        isLoading: true,
      })
      return Object.assign({}, state, { [tabName]: v })
    }

    case 'LOAD_TAB_FAILED': {
      const { tabName } = action
      const v = Object.assign({}, state[tabName], {
        isLoading: false,
      })
      return Object.assign({}, state, { [tabName]: v })
    }

    case 'LOAD_TAB_SUCCESS': {
      const { tabName, tab } = action

      // convert snake case -> camel case
      tab.sections = tab.sections.map(v => {
        v.novels = v.novels.map(novel => {
          const vv = Object.assign({}, novel, {
            key: novel.id,
            thumbnailUrl: novel.thumbnail_url,
            episodeUri: novel.episode_uri,
          })
          delete vv.thumbnail_url
          delete vv.episode_uri
          return vv
        })
        return v
      })

      const v = Object.assign({}, state[tabName], tab, {
        isLoading: false,
        isLoaded: true,
      })
      return Object.assign({}, state, { [tabName]: v })
    }

    default:
      return state
  }
}
export default tabs
