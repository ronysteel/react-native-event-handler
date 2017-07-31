// @flow

import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native'
import { connect } from 'react-redux'

import { loadTab } from '../actions/app'
import Stories from '../components/Stories'
import HeaderTitle from '../components/HeaderTitle'
import HomeHeaderLeft from '../containers/HomeHeaderLeft'
import HomeSettingContainer from '../containers/HomeSettingContainer'

import type { Story } from '../reducers/stories'

class Home extends React.Component {
  static navigationOptions = {
    // title: 'CHAT NOVEL',
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
    }
  }

  state = {
    isLoaded: false
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
