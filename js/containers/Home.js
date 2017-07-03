// @flow

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import Stories from '../components/Stories'
import { loadStories } from '../actions/story'

import type { Story } from '../reducers/stories'

class Home extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }

  componentDidMount() {
    this.props.dispatch(loadStories())
  }

  onPressStory(navigation: any, story: Story) {
    navigation.navigate('StoryDetail', {
      story,
    })
  }

  render() {
    const { stories, navigation } = this.props
    return (
      <View style={styles.container}>
        <Stories
          stories={ stories }
          onPressStory={ this.onPressStory.bind(null, navigation) }
        />
      </View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

const select = (store) => {
  return {
    stories: store.stories,
  }
}

export default connect(select)(Home)
