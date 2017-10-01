// @flow

import React from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { connect } from 'react-redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import firebase from '../firebase'
import { loadTab, loadTutorial, finishRequestReview } from '../actions/app'
import {
  sentSlectContentEvent,
  sendPushAllowEvent,
  sendPushDenyEvent
} from '../actions/event'
import { openHomePage } from '../actions/homePage'
import { onSelectContent } from './utils'
import Stories from '../components/Stories'
import HeaderTitle from '../components/HeaderTitle'
import HomeHeaderLeft from '../containers/HomeHeaderLeft'
import HomeSettingContainer from '../containers/HomeSettingContainer'
import TutorialContainer from '../containers/TutorialContainer'
import PushPermissionPopup from '../components/PushPermissionPopup'
import CategoryTabBar from '../components/CategoryTabBar'
import {
  STATUSBAR_HEIGHT,
  HEADER_HEIGHT,
  CATEGORY_TABBAR_HEIGHT
} from '../components/constants'
import { requestReviewPopup } from './utils'

import type { Story } from '../reducers/stories'

const headerInit = {
  title: 'Home',
  headerTitle: <HeaderTitle />,
  headerLeft: <HomeHeaderLeft />,
  headerTintColor: '#fff',
  headerStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + STATUSBAR_HEIGHT,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 0,
    opacity: 1,
    shadowColor: 'transparent'
  }
}

class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const isTutorial =
      navigation.state.params && navigation.state.params.tutorial

    let header = {}
    if (navigation.state.params) {
      header.headerStyle = {
        ...headerInit.headerStyle,
        transform: [{ translateY: navigation.state.params.scrollValue }],
        opacity: navigation.state.params.opacityValue
      }
    }
    if (isTutorial) {
      header.header = null
    }
    return { ...headerInit, ...header }
  }

  mounted = false
  _scrollValue = new Animated.Value(0)
  _clampedScrollValue = Animated.diffClamp(
    this._scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolateLeft: 'clamp'
    }),
    0,
    CATEGORY_TABBAR_HEIGHT + STATUSBAR_HEIGHT
  )

  state = {
    isLoaded: false
  }

  componentWillMount () {
    this.props.navigation.setParams({
      tutorial: !this.props.tutorialEnded,
      pushPopup: false,
      scrollValue: this._clampedScrollValue.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, -HEADER_HEIGHT],
        extrapolate: 'clamp'
      }),
      opacityValue: this._clampedScrollValue.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      })
    })
  }

  componentDidMount () {
    this.mounted = true
    Promise.all([
      this.props.loadHomeTab(),
      this.props.loadTutorial(this.props.tutorialEnded)
    ]).then(() => {
      if (this.mounted) {
        this.setState({ isLoaded: true })
      }
    })
  }

  componentWillUnmount () {
    this.mounted = false
  }

  renderTabBar = translateY => {
    return <CategoryTabBar translateY={translateY} />
  }

  /**
   * カテゴリータブ内のコンテンツをスクロールしたときに発火する
   */
  onScrollTabView = (delta, value) => {
    if (value === 0) {
      return
    }

    // スクロールポジションが一番上の時に
    // 下に引くとヘッダーを表示するようにする
    // 下に引いた時バウンドするので、そのときは何もせずreturnする
    if (value < 0) {
      delta = delta * 3
      if (this._scrollValue._value < this._scrollValue._value + delta) {
        return
      }
    }
    this._scrollValue.setValue(this._scrollValue._value + delta)
  }

  render () {
    const { stories, navigation, homeTab } = this.props
    if (!this.state.isLoaded) {
      return <View style={styles.container} />
    }

    const navigationParams = this.props.navigation.state.params

    if (navigationParams && navigationParams.tutorial) {
      const { novelId, episodeId } = this.props.tutorial
      return (
        <TutorialContainer
          novelId={novelId}
          episodeId={episodeId}
          navigation={this.props.navigation}
        />
      )
    }

    const translateY = this._clampedScrollValue.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT],
      extrapolate: 'clamp'
    })

    const headerOffset = this._clampedScrollValue.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [
        HEADER_HEIGHT + CATEGORY_TABBAR_HEIGHT + STATUSBAR_HEIGHT,
        CATEGORY_TABBAR_HEIGHT + STATUSBAR_HEIGHT
      ],
      extrapolate: 'clamp'
    })

    return (
      <Animated.View style={[styles.container]}>
        <ScrollableTabView
          renderTabBar={this.renderTabBar.bind(this, translateY)}
          prerenderingSiblingsNumber={1}
        >
          <Stories
            tabLabel='おすすめ'
            style={{ paddingTop: headerOffset }}
            sections={homeTab.sections}
            onSelectContent={this.props.onSelectContent}
            onScroll={this.onScrollTabView}
          />
          <Stories
            tabLabel='恋愛'
            style={{ paddingTop: headerOffset }}
            sections={homeTab.sections}
            onSelectContent={this.props.onSelectContent}
            onScroll={this.onScrollTabView}
          />
          <Stories
            tabLabel='SF'
            style={{ paddingTop: headerOffset }}
            sections={homeTab.sections}
            onSelectContent={this.props.onSelectContent}
            onScroll={this.onScrollTabView}
          />
          <Stories
            tabLabel='ホラー'
            style={{ paddingTop: headerOffset }}
            sections={homeTab.sections}
            onSelectContent={this.props.onSelectContent}
            onScroll={this.onScrollTabView}
          />
          <Stories
            tabLabel='ミステリー'
            style={{ paddingTop: headerOffset }}
            sections={homeTab.sections}
            onSelectContent={this.props.onSelectContent}
            onScroll={this.onScrollTabView}
          />
          <Stories
            tabLabel='ファンタジー'
            style={{ paddingTop: headerOffset }}
            sections={homeTab.sections}
            onSelectContent={this.props.onSelectContent}
            onScroll={this.onScrollTabView}
          />
        </ScrollableTabView>
        <HomeSettingContainer />
        {navigationParams && navigationParams.pushPopup ? (
          <PushPermissionPopup onPress={this.props.requestPushPermission} />
        ) : null}
        {this.props.isDisplayReviewAlert && (
          <View onLayout={this.props.requestReview} />
        )}
        <Animated.View
          style={[
            styles.dummyHeader,
            { transform: [{ translateY: translateY }] }
          ]}
        />
      </Animated.View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  dummyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + STATUSBAR_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.96)',
    zIndex: 0
  }
})

const select = store => {
  return {
    stories: store.stories,
    homeTab: store.tabs['home'],
    tutorialEnded: store.session.tutorialEnded || false,
    tutorial: store.tutorial,
    review: store.review,
    isDisplayReviewAlert:
      !store.review.reviewRequestEnded &&
      store.review.finishReadingCount >= 5 &&
      store.actionLog.currentScreen.type === 'HOME'
  }
}

const actions = (dispatch, props) => {
  return {
    loadHomeTab: () => {
      dispatch(loadTab('home'))
    },
    loadTutorial: (tutorialEnded: boolean) => {
      if (tutorialEnded) {
        return new Promise(resolve => resolve())
      }
      return dispatch(loadTutorial())
    },
    requestPushPermission: () => {
      firebase
        .messaging()
        .requestPermissions()
        .then(res => {
          if (res.granted === undefined) {
            return
          }

          if (res.granted) {
            dispatch(sendPushAllowEvent())
          } else {
            dispatch(sendPushDenyEvent())
          }
        })

      props.navigation.setParams({ pushPopup: false })
    },
    requestReview: () => {
      requestReviewPopup()
      dispatch(finishRequestReview())
    },
    onSelectContent: onSelectContent.bind(null, dispatch)
  }
}

export default connect(select, actions)(Home)
