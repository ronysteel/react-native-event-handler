import { NavigationActions } from 'react-navigation'
import { StatusBar } from 'react-native'

import { moveScreen } from '../actions/app'

const getCurrentRouteName = navigationState => {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getCurrentRouteName(route)
  }
  return route.routeName
}

const handleTracking = (
  store,
  isDeeplink,
  prevScreen,
  currentScreen,
  currentState
) => {
  if (prevScreen !== currentScreen) {
    switch (currentScreen) {
      case 'Home': {
        StatusBar.setBarStyle('dark-content')
        StatusBar.setHidden(false)
        store.dispatch(moveScreen('HOME'))
        return
      }
      case 'EpisodeDetail': {
        StatusBar.setHidden(true)
        store.dispatch(
          moveScreen('NOVEL', {
            ...currentState.routes[currentState.index].params
          })
        )
        return
      }
      case 'PrivacyPolicy': {
        StatusBar.setHidden(false)
        return
      }
      case 'Terms': {
        StatusBar.setHidden(false)
        return
      }
      case 'AboutSubscription': {
        StatusBar.setHidden(false)
        return
      }
    }
  }

  // 一番最初に開いたとき
  if (
    isDeeplink != 'DEEPLINK' &&
    prevScreen == 'Home' &&
    currentScreen == 'Home'
  ) {
    store.dispatch(moveScreen('HOME'))
    return
  }

  if (prevScreen === currentScreen) {
    switch (currentScreen) {
      case 'EpisodeDetail': {
        StatusBar.setHidden(true)
        store.dispatch(moveScreen('NOVEL'))
      }
    }
  }
}

const track = store => next => action => {
  if (
    action.type !== NavigationActions.NAVIGATE &&
    action.type !== NavigationActions.BACK &&
    action.type !== NavigationActions.RESET
  ) {
    return next(action)
  }
  const { getState } = store

  const prevScreen = getCurrentRouteName(getState().navigator)
  const result = next(action)
  const currentState = getState().navigator
  const { actionLog } = getState()
  const isDeeplink = actionLog.currentScreen.type === 'DEEPLINK'
  const currentScreen = getCurrentRouteName(currentState)
  handleTracking(store, isDeeplink, prevScreen, currentScreen, currentState)

  return result
}

export default track
