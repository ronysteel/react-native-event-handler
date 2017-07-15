// @flow
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import Detail from '../components/EpisodeDetail'
import { loadEpisode, updateReadState, pageView } from '../actions/story'
import { getAllScript } from '../reducers/scripts'

import type { Episode } from '../reducers/episodes'
import type { Script, Scripts, IndexedScripts } from '../reducers/scripts'
import type { ReadState } from '../reducers/readStates'

const getEpisode = (props) => props.navigation.state.params.episode
class EpisodeDetail extends React.Component {
  static navigationOptions = {
    title: 'Detail',
  }

  componentDidMount() {
    const episode = getEpisode(this.props)
    this.props.loadEpisode(episode.id).then(() => {
      this.props.pageView(episode)
      // this.props.resetReadIndex(episode.id)
    })
  }

  render() {
    const { episode, scripts, readState, onTapScreen } = this.props
    return <Detail
      episode={ episode }
      scripts={ scripts }
      readState={ readState }
      onTapScreen={ onTapScreen.bind(this, episode.id) }
    />
  }
}

const getScripts = (scripts: IndexedScripts, readState: ReadState): IndexedScripts => {
  return Object.keys(scripts).reduce((memo, k) => {
    if (readState && k <= readState.readIndex) {
      memo[k] = scripts[k]
    }
    return memo
  }, {})
}

const select = (store, props) => {
  const _episode = getEpisode(props)
  const episode: Episode = store.episodes[_episode.id]
  const readState: ReadState = store.readStates[_episode.id]
  const allScript: Scripts = getAllScript(store.episodes[_episode.id], store.scripts)
  return {
    episode,
    readState,
    allScript,
    scripts: getScripts(allScript, readState),
  }
}

const actions = (dispatch, props) => {
  return {
    loadEpisode: (episodeId: number) => dispatch(loadEpisode(episodeId)),
    onTapScreen: (episodeId: number) =>
      dispatch(updateReadState(episodeId)),
    resetReadIndex: (episodeId: number) => dispatch(updateReadState(episodeId, 0)),
    pageView: (episode: Episode) => dispatch(pageView(episode)),
  }
}

export default connect(select, actions)(EpisodeDetail)
