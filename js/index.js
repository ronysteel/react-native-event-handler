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
import Config from 'react-native-config'
import { parseNovelUri } from './utils'

import firebase from './firebase'
import reducers from './reducers'

import Router, { onNavigationStateChange } from './containers/Router'
import { signInAnonymously, saveDeviceToken } from './actions/user'
import { resetNavigator } from './actions/navigator'
import { loadTab, loadPurcasingProducts, moveScreen, loadCategories, setupReviewStatus } from './actions/app'
import {
  sendLeaveContentEvent,
  sendTutorialLeaveEvent,
  sendLocalNotificationOpenEvent,
} from './actions/event'

const URL_SCHEME = Config.URL_SCHEME

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

const episodeDetailPath = 'novels/:novelId/episodes/:episodeId'

class Root extends React.PureComponent {
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
        dispatch(resetNavigator()),
        dispatch(signInAnonymously()),
        dispatch(loadPurcasingProducts()),
        dispatch(setupReviewStatus()),
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
      const params = parseNovelUri(event.episodeUri)
      if (!params) {
        return
      }

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

  _handleOpenURL(event) {
    const re = new RegExp(`${URL_SCHEME}:\\/\\/novels\\/[^/]+\\/episodes\\/[^/]+`)
    if (re.test(event.url)) {
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
      const params = parseNovelUri(url)
      if (params) {
        Linking.openURL(`${URL_SCHEME}://novels/${params.novelId}/episodes/${params.episodeId}`)
      }

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
        <Router
          ref={ r => this.navigator = r }
          uriPrefix={ `${URL_SCHEME}://` }
          onNavigationStateChange={
            onNavigationStateChange.bind(null, this.state.store, this.isDeeplink)
          }
        />
      </Provider>
    )
  }
}

export default Root
