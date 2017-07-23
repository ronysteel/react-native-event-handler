// @flow

import React from 'react'
import { StyleSheet, Text, View, Linking } from 'react-native'
import { connect } from 'react-redux'

import Stories from '../components/Stories'
import HeaderTitle from '../components/HeaderTitle'
import { loadStories } from '../actions/story'

import type { Story } from '../reducers/stories'

const novel = {
  title: 'WALKING DEAD',
  tags: ['ホラー'],
  description: '次々と人間がゾンビへ姿を変えるなか、生存者たちは人類最後の希望にすがり、ともに旅を続ける。だがその先には終わりなき戦いが待ち受けていた。',
  thumbnail_url: 'https://s3-ap-northeast-1.amazonaws.com/obake.me/dummy-images/walking-dead.jpg',
  episode_uri: 'chatnovel://novels/1/episodes/10'
}
const sections = [
  {
    type: 'pickup',
    novels: [
      Object.assign({}, novel, { key: '1' })
    ]
  },
  {
    type: 'list',
    title: 'いま人気のノベル',
    novels: [
      Object.assign({}, novel, { key: '1' }),
      Object.assign({}, novel, { key: '2' }),
      Object.assign({}, novel, { key: '3' }),
    ]
  },
  {
    type: 'grid',
    title: 'ホラー',
    novels: [
      Object.assign({}, novel, { key: '1' }),
      Object.assign({}, novel, { key: '2' }),
      Object.assign({}, novel, { key: '3' }),
      Object.assign({}, novel, { key: '4' }),
    ]
  },
]

class Home extends React.Component {
  static navigationOptions = {
    // title: 'CHAT NOVEL',
    headerTitle: <HeaderTitle />,
    headerStyle: {
      backgroundColor: '#1a1a1a',
    },
    headerTitleStyle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  }

  componentDidMount() {
    this.props.dispatch(loadStories())
  }

  render() {
    const { stories, navigation } = this.props
    return (
      <View style={styles.container}>
        <Stories sections={ sections } />
      </View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
})

const select = (store) => {
  return {
    stories: store.stories,
  }
}

export default connect(select)(Home)
