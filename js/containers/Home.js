// @flow

import React from 'react'
import { StyleSheet, Text, View, Linking } from 'react-native'
import { connect } from 'react-redux'

import { loadTab } from '../actions/app'
import Stories from '../components/Stories'
import HeaderTitle from '../components/HeaderTitle'

import type { Story } from '../reducers/stories'

const novel = {
  title: 'WALKING DEAD',
  tags: ['ホラー'],
  description: '次々と人間がゾンビへ姿を変えるなか、生存者たちは人類最後の希望にすがり、ともに旅を続ける。だがその先には終わりなき戦いが待ち受けていた。',
  thumbnailUrl: 'https://s3-ap-northeast-1.amazonaws.com/obake.me/dummy-images/walking-dead.jpg',
  episodeUri: 'chatnovel://novels/1/episodes/16'
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
    homeTab: store.tabs['home'],
  }
}

const actions = (dispatch, props) => {
  return {
    loadHomeTab: () => dispatch(loadTab('home'))
  }
}

export default connect(select, actions)(Home)
