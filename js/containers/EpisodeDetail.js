// @flow
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import Detail from '../components/EpisodeDetail'
import { loadEpisode, updateReadState, pageView } from '../actions/story'
import { purchase } from '../actions/user'
import { getAllScript } from '../reducers/scripts'

import type { Episode } from '../reducers/episodes'
import type { Script, Scripts, IndexedScripts } from '../reducers/scripts'
import type { ReadState } from '../reducers/readStates'

class EpisodeDetail extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoading: true,
    }
  }

  static navigationOptions = {
    title: 'Detail',
  }

  componentDidMount() {
    const { novelId, episodeId } = this.props
    this.props.loadEpisode(novelId, episodeId).then(() => {
      this.setState({ isLoading: false })
      this.props.pageView(novelId, episodeId)
      this.props.resetReadIndex(episodeId)
    })
  }

  render() {
    const { episode, scripts, readState, paid, onTapScreen, onTapPurchase } = this.props

    if (this.state.isLoading) {
      return null
    }
    return <Detail
      episode={ episode }
      scripts={ scripts }
      readState={ readState }
      paid={ paid }
      onTapScreen={ onTapScreen.bind(this, episode.id) }
      onTapPurchase={ onTapPurchase.bind(this) }
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
  const { episodeId, novelId } = getParams(props)

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
    paid: store.session.paid,
  }
}

const actions = (dispatch, props) => {
  return {
    loadEpisode: (novelId: number, episodeId: number) =>
      dispatch(loadEpisode(novelId, episodeId)),
    onTapScreen: (episodeId: number) =>
      dispatch(updateReadState(episodeId)),
    onTapPurchase: () => dispatch(purchase()),
    resetReadIndex: (episodeId: number) => dispatch(updateReadState(episodeId, 0)),
    pageView: (novelId: number, episodeId: number) => dispatch(pageView(novelId, episodeId)),
  }
}

export default connect(select, actions)(EpisodeDetail)
