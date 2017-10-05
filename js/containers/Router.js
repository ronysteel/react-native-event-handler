// @flow
import React from 'react'
import { AppState, Linking } from 'react-native'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import {
  StackNavigator,
  NavigationActions,
  addNavigationHelpers
} from 'react-navigation'
import moment from 'moment'
import { parseNovelUri } from '../utils'

import Home from './Home'
import EpisodeDetail from './EpisodeDetail'
import PrivacyPolicy from '../components/PrivacyPolicy'
import Terms from '../components/Terms'
import AboutSubscriptionContainer from './AboutSubscriptionContainer'

import firebase from '../firebase'

import { signInAnonymously } from '../actions/user'
import { loadTab, moveScreen } from '../actions/app'
import {
  navigateAboutTerms,
  navigateAboutPrivacy,
  navigateAboutSubscription,
  navigateNovelFromNotification
} from '../actions/navigator'
import {
  sendLeaveContentEvent,
  sendTutorialLeaveEvent,
  sendNotificationOpenEvent,
  sendLocalNotificationOpenEvent,
  sendInitialURLEvent,
  sendOpenURLEvent
} from '../actions/event'

const URL_SCHEME = Config.URL_SCHEME
const episodeDetailPath = 'novels/:novelId/episodes/:episodeId'

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
  state = {
    appState: AppState.currentState
  }

  componentDidMount () {
    Linking.getInitialURL()
      .then(this._handleInitialURL.bind(this))
      .catch(() => {})

    Linking.addEventListener('url', this._handleOpenURL.bind(this))
    AppState.addEventListener('change', this._handleAppStateChange.bind(this))

    firebase.messaging().onMessage(this._handleOnMessage.bind(this))
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this._handleOpenURL.bind(this))
    AppState.removeEventListener(
      'change',
      this._handleAppStateChange.bind(this)
    )
  }

  /**
   * 通知を開いた時のハンドリング
   */
  _handleOnMessage (event) {
    if (event.local_notification) {
      if (event.episodeId) {
        this.props.dispatch(sendLocalNotificationOpenEvent(event.episodeId))
      }
    } else {
      this.props.dispatch(sendNotificationOpenEvent())
    }

    if (event.episodeUri) {
      const params = parseNovelUri(event.episodeUri)
      if (!params) {
        return
      }
      this.props.navigateNovelFromNotification(params.novelId, params.episodeId)
    }
  }

  _handleInitialURL (url: string) {
    this.props.dispatch(sendInitialURLEvent(url))
    if (url) {
      this.props.dispatch(moveScreen('DEEPLINK'))
    }
  }

  _episodeRegex = new RegExp(
    `${URL_SCHEME}:\\/\\/novels\\/[^/]+\\/episodes\\/[^/]+`
  )
  _aboutTermsRegex = new RegExp(`${URL_SCHEME}:\\/\\/about\\/terms`)
  _aboutPrivacyRegex = new RegExp(`${URL_SCHEME}:\\/\\/about\\/privacy`)
  _aboutSubscriptionRegex = new RegExp(
    `${URL_SCHEME}:\\/\\/about\\/subscription`
  )

  /**
   * ディープリンクを開いた時のルーティングをする
   */
  _handleOpenURL (event) {
    this.props.dispatch(sendOpenURLEvent(event.url))
    if (this._aboutTermsRegex.test(event.url)) {
      this.props.dispatch(navigateAboutTerms())
      return
    }

    if (this._aboutPrivacyRegex.test(event.url)) {
      this.props.dispatch(navigateAboutPrivacy())
      return
    }

    if (this._aboutSubscriptionRegex.test(event.url)) {
      this.props.dispatch(navigateAboutSubscription())
      return
    }

    if (this._episodeRegex.test(event.url)) {
      const params = parseNovelUri(event.url)

      if (this.state.appState !== 'active') {
        Promise.resolve()
          .then(() => this.props.dispatch(moveScreen('DEEPLINK')))
          .then(() => {
            if (!params) {
              return
            }

            return this.props.navigateNovelFromNotification(
              params.novelId,
              params.episodeId
            )
          })

        return
      }

      if (params) {
        this.props.navigateNovelFromNotification(
          params.novelId,
          params.episodeId
        )
      }

      return
    }

    if (
      /https:\/\/chatnovel\.jp\/novels\/[^/]+\/episodes\/[^/]+/.test(event.url)
    ) {
      const url = event.url.replace('https://chatnovel.jp/', '')
      const params = parseNovelUri(url)

      Promise.resolve()
        .then(() => {
          if (this.state.appState !== 'active') {
            return this.props.dispatch(moveScreen('DEEPLINK'))
          }
        })
        .then(() => {
          if (!params) {
            return
          }
          return this.props.navigateNovelFromNotification(
            params.novelId,
            params.episodeId
          )
        })
    }
  }

  /**
   * アプリの状態 Active/Inactive/Background のハンドリング
   */
  _handleAppStateChange (nextAppState) {
    const dispatch = this.props.dispatch
    const { actionLog } = this.props
    const screen = actionLog.currentScreen

    if (
      this.state.appState.match(/inactive|active/) &&
      nextAppState === 'background'
    ) {
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
        const { session, tutorial } = this.props
        if (!session.tutorialEnded) {
          dispatch(sendTutorialLeaveEvent(tutorial.episodeId))
        }
      }
    }

    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const { session } = this.props
      if (
        session.paid === true &&
        Number(session.paidAccountExpiresDate) <= moment().valueOf()
      ) {
        dispatch(signInAnonymously())
      }

      dispatch(loadTab('home'))
    }

    this.setState({ appState: nextAppState })
  }

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
  actionLog: store.actionLog,
  session: store.session,
  tutorial: store.tutorial,
  nav: store.navigator
})

const actions = (dispatch, props) => ({
  dispatch,
  navigateNovelFromNotification: (novelId: string, episodeId: string) =>
    dispatch(navigateNovelFromNotification(novelId, episodeId))
})

export default connect(select, actions)(App)
