// @flow
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import Detail from '../components/EpisodeDetail'
import { loadEpisode, updateReadState } from '../actions/story'

import type { Episode } from '../reducers/episodes'
import type { Scripts } from '../reducers/scripts'
import type { ReadState } from '../reducers/readStates'

const getEpisode = (props) => props.navigation.state.params.episode
class EpisodeDetail extends React.Component {
  static navigationOptions = {
    title: 'Detail',
  }

  componentDidMount() {
    const episode = getEpisode(this.props)
    this.props.loadEpisode(episode.id)
    this.props.resetReadIndex(episode.id)
  }

  render() {
    const { episode, scripts, readState, onTapScreen } = this.props
    return <Detail
      episode={ episode }
      scripts={ scripts }
      onTapScreen={ onTapScreen.bind(this, episode.id, episode.scriptIds.length) }
    />
  }
}

const getScripts = (episode: Episode, scripts: Scripts, readState: ReadState) => {
  return episode.scriptIds.reduce((memo, id) => {
    if (scripts[id].scriptOrder <= readState.readIndex) {
      memo.push(scripts[id])
    }
    return memo
  }, [])
}

const select = (store, props) => {
  const _episode = getEpisode(props)
  const episode: Episode = store.episodes[_episode.id]
  const readState: ReadState = store.readStates[_episode.id]
  return {
    episode,
    readState,
    scripts: getScripts(store.episodes[_episode.id], store.scripts, readState),
  }
}

const actions = (dispatch, props) => {
  return {
    loadEpisode: (episodeId: number) => dispatch(loadEpisode(episodeId)),
    onTapScreen: (episodeId: number, scriptLength: number) =>
      dispatch(updateReadState(episodeId, scriptLength)),
    resetReadIndex: (episodeId: number) => dispatch(updateReadState(episodeId, 0)),
  }
}

export default connect(select, actions)(EpisodeDetail)
