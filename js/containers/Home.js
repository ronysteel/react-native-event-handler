// @flow

import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native'
import { connect } from 'react-redux'

import firebase from '../firebase'
import { loadTab, loadTutorial } from '../actions/app'
import { sentSlectContentEvent, sendPushAllowEvent, sendPushDenyEvent, finishRequestReview } from '../actions/event'
import { openHomePage } from '../actions/homePage'
import { onSelectContent } from './utils'
import Stories from '../components/Stories'
import HeaderTitle from '../components/HeaderTitle'
import HomeHeaderLeft from '../containers/HomeHeaderLeft'
import HomeSettingContainer from '../containers/HomeSettingContainer'
import TutorialContainer from '../containers/TutorialContainer'
import PushPermissionPopup from '../components/PushPermissionPopup'

import type { Story } from '../reducers/stories'

const headerInit = {
  title: 'Home',
  headerTitle: <HeaderTitle />,
  headerLeft: <HomeHeaderLeft />,
  headerStyle: {
    backgroundColor: '#f5f5f5',
    borderColor: '#999',
    borderBottomWidth: 0.5,
  },
  headerTitleStyle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
}

class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const isTutorial = (navigation.state.params && navigation.state.params.tutorial)

    let header = {}
    if (isTutorial) {
      header = { header: null }
    }
    return Object.assign({}, headerInit, header)
  }

  state = {
    isLoaded: false
  }

  componentWillMount() {
    this.props.navigation.setParams({
      tutorial: !this.props.tutorialEnded,
      pushPopup: false,
    })
  }

  componentDidMount() {
    Promise.all([
      this.props.loadHomeTab(),
      this.props.loadTutorial(this.props.tutorialEnded),
    ])
      .then(() => {
        this.setState({ isLoaded: true })
      })
  }

  render() {
    const { stories, navigation, homeTab } = this.props
    if (!this.state.isLoaded) {
      return <View style={ styles.container } />
    }

    if (this.props.navigation.state.params.tutorial) {
      const { novelId, episodeId } = this.props.tutorial
      return (
        <TutorialContainer
          novelId={ novelId }
          episodeId={ episodeId }
          navigation={ this.props.navigation }
        />
      )
    }

    return (
      <View style={ styles.container }>
        <Stories sections={ homeTab.sections } onSelectContent={ this.props.onSelectContent } />
        <HomeSettingContainer />
        { this.props.navigation.state.params.pushPopup
          ?  <PushPermissionPopup onPress={ this.props.requestPushPermission } />
          : null
        }
        { !this.props.review.reviewRequestEnded && this.props.review.finishReadingCount >=5
          ? <View onLayout= { this.props.requestReview } /> : null
        }
      </View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
})

const select = (store) => {
  return {
    stories: store.stories,
    homeTab: store.tabs['home'],
    tutorialEnded: store.session.tutorialEnded || false,
    tutorial: store.tutorial,
    review: store.review,
  }
}

const actions = (dispatch, props) => {
  return {
    loadHomeTab: () => {
      dispatch(loadTab('home'))
      dispatch(openHomePage())
    },
    loadTutorial: (tutorialEnded: boolean) => {
      if (tutorialEnded) {
        return new Promise(resolve => resolve())
      }
      return dispatch(loadTutorial())
    },
    requestPushPermission: () => {
      firebase.messaging().requestPermissions()
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
      Alert.alert(
        'CHAT NOVELをレビューする',
        'いつもご利用いただきましてありがとうございます！\nこれからも面白いノベルを作る励みになりますので☆5のレビューをお願いします！',
        [
          {text: '☆5をつける', onPress: () => {
            Linking.openURL('itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=1263726333&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software')
          }},
          {text: 'バグ・改善してほしい', onPress: () => {
            Linking.openURL('mailto:chatnovel-info@newn.co?subject=CHAT NOVELバグ・改善要望')
          }},
          {text: 'また今度', onPress: () => console.log('Dismiss')},
        ],
      )
      dispatch(finishRequestReview())
    },
    onSelectContent: onSelectContent.bind(null, dispatch),
  }
}

export default connect(select, actions)(Home)
