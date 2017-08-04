// @flow

import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native'
import { connect } from 'react-redux'

import firebase from '../firebase'
import { loadTab } from '../actions/app'
import { sentSlectContentEvent } from '../actions/event'
import Stories from '../components/Stories'
import HeaderTitle from '../components/HeaderTitle'
import HomeHeaderLeft from '../containers/HomeHeaderLeft'
import HomeSettingContainer from '../containers/HomeSettingContainer'
import TutorialContainer from '../containers/TutorialContainer'
import PushPermissionPopup from '../components/PushPermissionPopup'

import type { Story } from '../reducers/stories'

const headerInit = {
  headerTitle: <HeaderTitle />,
  headerLeft: <HomeHeaderLeft />,
  headerStyle: {
    backgroundColor: '#1a1a1a',
    borderColor: '#3a3a3a',
    borderBottomWidth: 0.5,
  },
  headerTitleStyle: {
    color: '#fff',
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
    this.props.loadHomeTab()
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
      return (
        <TutorialContainer
          novelId={ '01BPGRVG5DP32HK9M4WZGS69YY' }
          episodeId={ '01BPGRVG5F6N3PHEWW5Q71KHMB' }
          navigation={ this.props.navigation }
        />
      )
    }

    return (
      <View style={ styles.container }>
        <Stories sections={ homeTab.sections } onSlectContent={ this.props.onSlectContent } />
        <HomeSettingContainer />
        { this.props.navigation.state.params.pushPopup
          ?  <PushPermissionPopup onPress={ this.props.requestPushPermission } />
          : null
        }
      </View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
})

const select = (store) => {
  return {
    stories: store.stories,
    homeTab: store.tabs['home'],
    tutorialEnded: store.session.tutorialEnded || false,
  }
}

const actions = (dispatch, props) => {
  return {
    loadHomeTab: () => dispatch(loadTab('home')),
    requestPushPermission: () => {
      firebase.messaging().requestPermissions()
      props.navigation.setParams({ pushPopup: false })
    },
    onSlectContent: (item) => {
      Linking.openURL(item.episodeUri)
    },
  }
}

export default connect(select, actions)(Home)
