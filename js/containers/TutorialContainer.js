// @flow
import React from 'react'
import { Modal, StyleSheet, Text, View, StatusBar } from 'react-native'
import { connect } from 'react-redux'

import Detail from '../components/EpisodeDetail'
import {
  loadEpisode,
  updateReadState,
  pageView,
} from '../actions/story'
import { getAllScript } from '../reducers/scripts'

import type { Episode } from '../reducers/episodes'
import type { Script, Scripts, IndexedScripts } from '../reducers/scripts'
import type { ReadState } from '../reducers/readStates'

class TutorialContainer extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoading: true,
    }
  }

  componentDidMount() {
    const { novelId, episodeId, navigation, uid } = this.props

    let categoryId
    Promise.all([
      this.props.loadEpisode(novelId, episodeId)
        .then(() => {
          this.props.pageView(novelId, episodeId)
          this.props.resetReadIndex(episodeId)
        }),
    ])
      .then(() => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    const {
      novel, episode, scripts, readState,
      characters, uid, navigation, onTapScreen,
    } = this.props

    if (this.state.isLoading) {
      return <View style={{ flex: 1, backgroundColor: '#212121' }}></View>
    }

    return (
      <View style={{ flex: 1 }}>
        <Detail
          novel={ novel }
          episode={ episode }
          scripts={ scripts }
          scriptValues={ Object.values(scripts) }
          readState={ readState }
          characters={ characters }
          onTapScreen={ onTapScreen.bind(this, uid, episode.id) }
          isTutorial={ true }
          showHeader={ () => {} }
          hideHeader={ () => {} }
        />
      </View>
    )
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
  const { episodeId, novelId } = props

  const novel = store.novels[novelId]
  const episode: Episode = store.episodes[episodeId]
  const readState: ReadState = store.readStates[episodeId]
  const allScript: Scripts = getAllScript(store.episodes[episodeId], store.scripts)
  return {
    uid: store.session.uid,
    novelId,
    episodeId,
    episode,
    readState,
    allScript,
    novel,
    scripts: allScript,
    characters: store.characters[episodeId],
  }
}

const actions = (dispatch, props) => {
  return {
    loadEpisode: (novelId: number, episodeId: number) =>
      dispatch(loadEpisode(novelId, episodeId)),
    onTapScreen: (userId: number, episodeId: number) => (
      dispatch(updateReadState(episodeId))
    ),
    resetReadIndex: (episodeId: number) => dispatch(updateReadState(episodeId, 0)),
    pageView: (novelId: number, episodeId: number) => dispatch(pageView(novelId, episodeId)),
  }
}

export default connect(select, actions)(TutorialContainer)
