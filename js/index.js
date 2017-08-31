// @flow

import React from 'react'
import { View, StatusBar, AsyncStorage, AppState, Linking } from 'react-native'
import { compose, applyMiddleware, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import { Provider } from 'react-redux'
import { StackNavigator, NavigationActions, addNavigationHelpers } from 'react-navigation'
import pathToRegexp from 'path-to-regexp'
import moment from 'moment'

import firebase from './firebase'
import reducers from './reducers'
import Home from './containers/Home'
import EpisodeDetail from './containers/EpisodeDetail'
import AboutSubscriptionContainer from './containers/AboutSubscriptionContainer'
import PrivacyPolicy from './components/PrivacyPolicy'
import Terms from './components/Terms'

import { signInAnonymously, saveDeviceToken } from './actions/user'
import { loadTab, loadPurcasingProducts, moveScreen, loadCategories } from './actions/app'
import {
  sendLeaveContentEvent,
  sendTutorialLeaveEvent,
  sendLocalNotificationOpenEvent,
} from './actions/event'

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
  PrivacyPolicy: { screen: PrivacyPolicy, path: 'about/privacy' },
  Terms: { screen: Terms, path: 'about/terms' },
  AboutSubscription: { screen: AboutSubscriptionContainer, path: 'about/subscription' },
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
      ])
        .then(() => {
          dispatch(loadCategories())
        })
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
      .then(this._handleInitialURL.bind(this))
      .catch(() => {})

    Linking.addEventListener('url', this._handleOpenURL.bind(this))
    AppState.addEventListener('change', this._handleAppStateChange.bind(this))

    firebase.messaging().onMessage(this._handleOnMessage.bind(this))
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL.bind(this))
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this))
  }

  _handleOnMessage(event) {
    if (event.local_notification) {
      if (event.episodeId) {
        this.state.store.dispatch(sendLocalNotificationOpenEvent(event.episodeId))
      }
    }

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
  }

  _handleInitialURL(url: string) {
    if (url) {
      this.state.store.dispatch(moveScreen('DEEPLINK'))
      this.isDeeplink = 'DEEPLINK'
    }
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

      return
    }

    if (/https:\/\/chatnovel\.jp\/novels\/[^/]+\/episodes\/[^/]+/.test(event.url)) {
      if (this.state.appState !== 'active') {
        this.state.store.dispatch(moveScreen('DEEPLINK'))
        this.isDeeplink = 'DEEPLINK'
      }

      const url = event.url.replace('https://chatnovel.jp/', '')
      const keys = []
      const re = pathToRegexp(episodeDetailPath, keys)
      const ps = re.exec(url)
      const params = keys.reduce((memo, v, i) => {
        memo[v.name] = ps[i + 1]
        return memo
      }, {})

      Linking.openURL(`chatnovel://novels/${params.novelId}/episodes/${params.episodeId}`)
      return
    }
  }

  _handleAppStateChange(nextAppState) {
    const dispatch = this.state.store.dispatch
    const { actionLog } = this.state.store.getState()
    const screen = actionLog.currentScreen

    if (this.state.appState.match(/inactive|active/) && nextAppState === 'background') {
      if (screen.type == 'NOVEL') {
        //
        // ノベルを読んでいる途中でアプリを閉じたときに
        // 離脱イベントを送信する
        //
        dispatch(sendLeaveContentEvent(screen.novel.episodeId))

      } else if (screen.type == 'HOME') {
        //
        // チュートリアルのノベルを読んでいる途中でアプリを閉じたときに
        // 離脱イベントを送信する
        //
        const { session, tutorial } = this.state.store.getState()
        if (!session.tutorialEnded) {
          dispatch(sendTutorialLeaveEvent(tutorial.episodeId))
        }
      }
    }

    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      const { session } = this.state.store.getState()
      if (session.paid === true &&
          Number(session.paidAccountExpiresDate) <= moment().valueOf()
      ) {
        dispatch(signInAnonymously())
      }

      dispatch(loadTab('home'))
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
