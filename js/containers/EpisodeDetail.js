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

class EpisodeDetail extends React.Component {
  static navigationOptions = {
    title: 'Detail',
  }

  componentDidMount() {
    const { novelId, episodeId } = this.props
    this.props.loadEpisode(episodeId).then(() => {
      this.props.pageView(novelId, episodeId)
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

const getParams = (props) => props.navigation.state.params

const select = (store, props) => {
  const { episodeId, novelId} = getParams(props)

  const episode: Episode = store.episodes[episodeId]
  const readState: ReadState = store.readStates[episodeId]
  const allScript: Scripts = getAllScript(store.episodes[episodeId], store.scripts)
  return {
    novelId,
    episodeId,
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
    pageView: (novelId: number, episodeId: number) => dispatch(pageView(novelId, episodeId)),
  }
}

export default connect(select, actions)(EpisodeDetail)
