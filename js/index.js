// @flow

import React from 'react'
import { View, StatusBar, AsyncStorage, AppState, Linking } from 'react-native'
import { compose, applyMiddleware, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import { Provider } from 'react-redux'
import { StackNavigator, NavigationActions, addNavigationHelpers } from 'react-navigation'
import pathToRegexp from 'path-to-regexp'

import firebase from './firebase'
import reducers from './reducers'
import Home from './containers/Home'
import EpisodeDetail from './containers/EpisodeDetail'

import { signInAnonymously, saveDeviceToken } from './actions/user'
import { loadPurcasingProducts, moveScreen, loadCategories } from './actions/app'
import { sendLeaveContentEvent } from './actions/event'

function setupStore(onComplete: () => void) {
  const middlewares = []
  if (__DEV__) {
    const { logger } = require(`redux-logger`)
    middlewares.push(logger)
  }
  middlewares.push(thunk)

  const _createStore = compose(applyMiddleware(...middlewares))(createStore)
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
        StatusBar.setBarStyle('dark-content')
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

const episodeDetailPath = 'novels/:novelId/episodes/:episodeId'

const App = StackNavigator({
  Home: { screen: Home },
  EpisodeDetail: { screen: EpisodeDetail, path: episodeDetailPath },
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
      appState: AppState.currentState,
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
    AppState.addEventListener('change', this._handleAppStateChange.bind(this))

    firebase.messaging()
      .onMessage(event => {
        if (event.episodeUri) {
          const { path } = this._urlToPathAndParams(event.episodeUri)
          const keys = []
          const re = pathToRegexp(episodeDetailPath, keys)
          const ps = re.exec(path)

          const params = keys.reduce((memo, v, i) => {
            memo[v.name] = ps[i + 1]
            return memo
          }, {})

          this.navigator.dispatch(NavigationActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({ routeName: 'Home' }),
              NavigationActions.navigate({ routeName: 'EpisodeDetail', params }),
            ]
          }))
        }
      })
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL.bind(this))
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this))
  }


  _urlToPathAndParams(url: string) {
    const params = {}
    const delimiter = 'chatnovel://' || '://'
    let path = url.split(delimiter)[1]
    if (typeof path === 'undefined') {
      path = url
    }
    return {
      path,
      params,
    }
  }

  _handleOpenURL(event) {
    if (/chatnovel:\/\/novels\/[^/]+\/episodes\/[^/]+/.test(event.url)) {
      if (this.state.appState !== 'active') {
        this.state.store.dispatch(moveScreen('DEEPLINK'))
        this.isDeeplink = 'DEEPLINK'
      }
    }
  }

  _handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|active/) && nextAppState === 'background') {
      const { actionLog } = this.state.store.getState()
      const dispatch = this.state.store.dispatch

      const screen = actionLog.currentScreen
      if (screen.type == 'NOVEL') {
        dispatch(sendLeaveContentEvent(screen.novel.episodeId))
      }
    }
    this.setState({ appState: nextAppState })
  }

  render() {
    if (this.state.isLoading) {
      return <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}></View>
    }
    return (
      <Provider store={this.state.store}>
        <App
          ref={ r => this.navigator = r }
          uriPrefix={ 'chatnovel://' }
          onNavigationStateChange={ onNavigationStateChange.bind(null, this.state.store, this.isDeeplink) }
        />
      </Provider>
    )
  }
}

export default Root
