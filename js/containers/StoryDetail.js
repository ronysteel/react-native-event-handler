// @flow
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import Detail from '../components/StoryDetail'
import { loadStory } from '../actions/story'

import type { Story } from '../reducers/stories'
import type { Episode, Episodes } from '../reducers/episodes'

const getStory = (props) => props.navigation.state.params.story
class StoryDetail extends React.Component {
  static navigationOptions = {
    title: 'Detail'
  }

  componentDidMount() {
    const story = getStory(this.props)
    this.props.dispatch(loadStory(story.id))
  }

  onPressEpisode(navigation: any, episode: Episode) {
    navigation.navigate('EpisodeDetail', {
      episode,
    })
  }

  render() {
    const { story, episodes, navigation } = this.props
    return <Detail
      story={ story }
      episodes={ episodes }
      onPressEpisode={ this.onPressEpisode.bind(null, navigation) }
    />
  }
}

const getEpisodes = (story: Story, episodes: Episodes) => {
  return story.episodeIds.map(id => episodes[id])
}

const select = (store, props) => {
  const story = getStory(props)
  return {
    story: store.stories[story.id],
    episodes: getEpisodes(store.stories[story.id], store.episodes),
  }
}

export default connect(select)(StoryDetail)
