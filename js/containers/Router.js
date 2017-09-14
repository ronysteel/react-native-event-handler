// @flow
import React from 'react'
import { StatusBar } from 'react-native'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import {
  StackNavigator,
  NavigationActions,
  addNavigationHelpers
} from 'react-navigation'

import Home from './Home'
import EpisodeDetail from './EpisodeDetail'
import PrivacyPolicy from '../components/PrivacyPolicy'
import Terms from '../components/Terms'
import AboutSubscriptionContainer from './AboutSubscriptionContainer'

const episodeDetailPath = 'novels/:novelId/episodes/:episodeId'
const URL_SCHEME = Config.URL_SCHEME

// gets the current screen from navigation state
const getCurrentRouteName = navigationState => {
  if (!navigationState) {
    return null
  }

  const route = navigationState.routes[navigationState.index]
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route)
  }
  return route.routeName
}

export const onNavigationStateChange = (
  store,
  isDeeplink,
  prevState,
  currentState
) => {
  const currentScreen = getCurrentRouteName(currentState)
  const prevScreen = getCurrentRouteName(prevState)

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

export const Navigator = StackNavigator(
  {
    Home: { screen: Home },
    EpisodeDetail: { screen: EpisodeDetail, path: episodeDetailPath },
    PrivacyPolicy: { screen: PrivacyPolicy, path: 'about/privacy' },
    Terms: { screen: Terms, path: 'about/terms' },
    AboutSubscription: {
      screen: AboutSubscriptionContainer,
      path: 'about/subscription'
    }
  },
  {
    headerMode: 'screen'
  }
)

class App extends React.PureComponent {
  render () {
    return (
      <Navigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })}
      />
    )
  }
}

const select = (store, props) => ({
  nav: store.navigator
})

export default connect(select)(App)
