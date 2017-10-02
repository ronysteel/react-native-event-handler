// @flow
import type { Action } from '../actions/types'

export type Tabs = {
  [tabName: string]: Tab
}

type Section = {
  type: string,
  title: string,
  novels: Array<any>
}

export type Tab = {
  name: string,
  sections: Array<Section>,
  isLoading: boolean,
  isLoaded: boolean,
  tabOrder: number,
  isAvailable: boolean
}

const initialStates: Tabs = {}

function tabs (state: Tabs = initialStates, action: Action): Tabs {
  switch (action.type) {
    case 'LOAD_AVAILABLE_TABS_SUCCESS': {
      const { tabNames } = action
      const mergedTabNames = [...new Set([...tabNames, ...Object.keys(state)])]
      const nextState = mergedTabNames.reduce((memo, tabName) => {
        memo[tabName] = {
          ...(state[tabName] || {}),
          tabOrder: tabNames.indexOf(tabName),
          isAvailable: tabNames.includes(tabName)
        }
        return memo
      }, {})
      return nextState
    }

    case 'LOAD_TAB_REQUEST': {
      const { tabName } = action
      const v = { ...state[tabName], isLoading: true }
      return { ...state, [tabName]: v }
    }

    case 'LOAD_TAB_FAILED': {
      const { tabName } = action
      const v = { ...state[tabName], isLoading: false }
      return { ...state, [tabName]: v }
    }

    case 'LOAD_TAB_SUCCESS': {
      const { tabName, tab } = action
      tab.sections = Object.values(tab.sections).map((v, i) => {
        v.id = i
        return v
      })
      const v = {
        ...state[tabName],
        ...tab,
        isLoading: false,
        isLoaded: true
      }
      return { ...state, [tabName]: v }
    }

    default:
      return state
  }
}

export function getAvailableTabs (tabs: Tabs): Array<Tab> {
  return Object.keys(tabs)
    .reduce((memo, tabName) => {
      if (tabs[tabName].isAvailable && tabs[tabName].isLoaded) {
        memo.push(tabs[tabName])
      }
      return memo
    }, [])
    .sort((a: Tab, b: Tab) => a.tabOrder - b.tabOrder)
}

export default tabs
