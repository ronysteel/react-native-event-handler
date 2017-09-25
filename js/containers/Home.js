// @flow

import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native'
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
import { requestReviewPopup } from './utils'

import type { Story } from '../reducers/stories'

const headerInit = {
  title: 'Home',
  headerTitle: <HeaderTitle />,
  headerLeft: <HomeHeaderLeft />,
  headerStyle: {
    backgroundColor: '#fff',
    borderWidth: 0,
    shadowColor: 'transparent'
  },
  headerTitleStyle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold'
  }
}

class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const isTutorial =
      navigation.state.params && navigation.state.params.tutorial

    let header = {}
    if (isTutorial) {
      header = { header: null }
    }
    return Object.assign({}, headerInit, header)
  }

  mounted = false

  state = {
    isLoaded: false
  }

  componentWillMount () {
    this.props.navigation.setParams({
      tutorial: !this.props.tutorialEnded,
      pushPopup: false
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

    return (
      <View style={styles.container}>
        <ScrollableTabView
          renderTabBar={() => <CategoryTabBar />}
        >
          <Stories
            tabLabel="おすすめ"
            sections={homeTab.sections}
            onSelectContent={this.props.onSelectContent}
          />
        </ScrollableTabView>
        <HomeSettingContainer />
        {navigationParams && navigationParams.pushPopup ? (
          <PushPermissionPopup onPress={this.props.requestPushPermission} />
        ) : null}
        {this.props.isDisplayReviewAlert && (
          <View onLayout={this.props.requestReview} />
        )}
      </View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3'
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
