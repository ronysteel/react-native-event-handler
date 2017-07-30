// @flow

import React from 'react'
import { View, StatusBar, AsyncStorage, Linking } from 'react-native'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import { Provider } from 'react-redux'
import { StackNavigator } from 'react-navigation'

import reducers from './reducers'
import Home from './containers/Home'
import EpisodeDetail from './containers/EpisodeDetail'

import { signInAnonymously } from './actions/user'
import { loadPurcasingProducts } from './actions/app'

function setupStore(onComplete: () => void) {
  const _createStore = applyMiddleware(thunk)(createStore)
  const store = autoRehydrate()(_createStore)(reducers)
  persistStore(store, { storage: AsyncStorage }, onComplete);

  return store
}

// gets the current screen from navigation state
const getCurrentRouteName = (navigationState) => {
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

const onNavigationStateChange = (prevState, currentState) => {
  const currentScreen = getCurrentRouteName(currentState)
  const prevScreen = getCurrentRouteName(prevState)

  if (prevScreen !== currentScreen) {
    switch (currentScreen) {
      case 'Home': {
        StatusBar.setBarStyle('light-content')
        StatusBar.setHidden(false)
        break;
      }
      case 'EpisodeDetail': {
        StatusBar.setHidden(true)
      }
    }
  }
}

const App = StackNavigator({
  Home: { screen: Home },
  EpisodeDetail: { screen: EpisodeDetail, path: 'novels/:novelId/episodes/:episodeId' },
}, {
  headerMode: 'screen',
})

class Root extends React.Component {
  state: {
    isLoading: boolean;
    store: any;
  }

  constructor() {
    super()

    this.state = {
      isLoading: true,
      store: undefined,
    }

    this.state.store = setupStore((err, state) => {
      this.setState({ isLoading: false })
    })
    this.state.store.dispatch(signInAnonymously())
    this.state.store.dispatch(loadPurcasingProducts())
  }

  render() {
    if (this.state.isLoading) {
      return null
    }
    return (
      <Provider store={this.state.store}>
        <App
          uriPrefix={ 'chatnovel://' }
          onNavigationStateChange={ onNavigationStateChange }
        />
      </Provider>
    )
  }
}

export default Root
