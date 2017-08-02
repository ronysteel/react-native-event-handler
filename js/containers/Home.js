// @flow

import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native'
import { connect } from 'react-redux'

import { loadTab } from '../actions/app'
import Stories from '../components/Stories'
import HeaderTitle from '../components/HeaderTitle'
import HomeHeaderLeft from '../containers/HomeHeaderLeft'
import HomeSettingContainer from '../containers/HomeSettingContainer'
import TutorialContainer from '../containers/TutorialContainer'

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
    this.props.navigation.setParams({ tutorial: true });
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
          novelId={ '01BPGSTPTBZJEZ09VZC1GZG2VQ' }
          episodeId={ '01BPGSTPTCYYH3WD894ZTW0M0N' }
        />
      )
    }

    return (
      <View style={ styles.container }>
        <Stories sections={ homeTab.sections } />
        <HomeSettingContainer />
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
  }
}

const actions = (dispatch, props) => {
  return {
    loadHomeTab: () => dispatch(loadTab('home'))
  }
}

export default connect(select, actions)(Home)
