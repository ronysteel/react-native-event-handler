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
      tab.sections = Object.values(tab.sections).map((v, i) => {
        v.id = i
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
