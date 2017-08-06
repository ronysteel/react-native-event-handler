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

import { signInAnonymously, saveDeviceToken } from './actions/user'
import { loadPurcasingProducts, moveScreen, loadCategories } from './actions/app'

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

const onNavigationStateChange = (store, isDeeplink, prevState, currentState) => {
  const currentScreen = getCurrentRouteName(currentState)
  const prevScreen = getCurrentRouteName(prevState)

  if (prevScreen !== currentScreen) {
    switch (currentScreen) {
      case 'Home': {
        StatusBar.setBarStyle('light-content')
        StatusBar.setHidden(false)
        store.dispatch(moveScreen('HOME'))
        return
      }
      case 'EpisodeDetail': {
        StatusBar.setHidden(true)
        store.dispatch(moveScreen('NOVEL', {
          ...currentState.routes[currentState.index].params
        }))
        return
      }
    }
  }

  // 一番最初に開いたとき
  if (isDeeplink != 'DEEPLINK' && prevScreen =='Home' && currentScreen == 'Home') {
    store.dispatch(moveScreen('HOME'))
    return
  }

  if (prevScreen === currentScreen) {
    switch (currentScreen) {
      case 'EpisodeDetail': {
        StatusBar.setHidden(true)
        store.dispatch(moveScreen('NOVEL'))
        return
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
      const dispatch = this.state.store.dispatch

      Promise.all([
        dispatch(signInAnonymously()),
        dispatch(loadPurcasingProducts()),
        dispatch(loadCategories()),
      ])
        .then(() => {
          this.setState({ isLoading: false })
        })
        .then(() => {
          dispatch(saveDeviceToken())
        })
    })

    this.isDeeplink = undefined
  }

  componentDidMount() {
    Linking.getInitialURL()
      .then(url => {
        if (url) {
          this.state.store.dispatch(moveScreen('DEEPLINK'))
          this.isDeeplink = 'DEEPLINK'
        }
      })
      .catch(() => {})

    Linking.addEventListener('url', this._handleOpenURL.bind(this))
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL.bind(this))
  }

  _handleOpenURL(event) {
    if (/chatnovel:\/\/novels\/[^/]+\/episodes\/[^/]+/.test(event.url)) {
      this.state.store.dispatch(moveScreen('DEEPLINK'))
      this.isDeeplink = 'DEEPLINK'
    }
  }

  render() {
    if (this.state.isLoading) {
      return <View style={{ flex: 1, backgroundColor: '#212121' }}></View>
    }
    return (
      <Provider store={this.state.store}>
        <App
          uriPrefix={ 'chatnovel://' }
          onNavigationStateChange={ onNavigationStateChange.bind(null, this.state.store, this.isDeeplink) }
        />
      </Provider>
    )
  }
}

export default Root
