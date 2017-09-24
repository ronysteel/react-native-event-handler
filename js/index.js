// @flow

import React from 'react'
import { View, StatusBar, AsyncStorage, AppState, Linking } from 'react-native'
import { Provider } from 'react-redux'
import {
  StackNavigator,
  NavigationActions,
  addNavigationHelpers
} from 'react-navigation'
import moment from 'moment'
import Config from 'react-native-config'
import { parseNovelUri } from './utils'

import firebase from './firebase'
import configureStore from './middlewares'

import Router, { onNavigationStateChange } from './containers/Router'
import { signInAnonymously, saveDeviceToken } from './actions/user'
import { resetNavigator } from './actions/navigator'
import {
  applicationStartup,
  loadTab,
  loadPurcasingProducts,
  moveScreen,
  loadCategories,
  setupReviewStatus
} from './actions/app'
import {
  sendLeaveContentEvent,
  sendTutorialLeaveEvent,
  sendNotificationOpenEvent,
  sendLocalNotificationOpenEvent
} from './actions/event'

const URL_SCHEME = Config.URL_SCHEME

const episodeDetailPath = 'novels/:novelId/episodes/:episodeId'

class Root extends React.PureComponent {
  state: {
    isLoading: boolean,
    store: any
  }

  constructor () {
    super()

    this.state = {
      isLoading: true,
      store: undefined
    }

    this.state.store = configureStore((err, state) => {
      const dispatch = this.state.store.dispatch

      Promise.all([
        dispatch(resetNavigator()),
        dispatch(signInAnonymously()),
        dispatch(loadPurcasingProducts()),
        dispatch(applicationStartup()),
        dispatch(setupReviewStatus())
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
  }

  render () {
    if (this.state.isLoading) {
      return <View style={{ flex: 1, backgroundColor: '#f3f3f3' }} />
    }
    return (
      <Provider store={this.state.store}>
        <Router />
      </Provider>
    )
  }
}

export default Root
