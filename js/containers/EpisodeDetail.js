// @flow
import React from 'react'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import { connect } from 'react-redux'

import Detail from '../components/EpisodeDetail'
import {
  loadEpisode,
  loadNovelMetadata,
  loadRecommends,
  loadShareLinks,
  updateReadState,
  pageView,
} from '../actions/story'
import { purchase } from '../actions/user'
import { getAllScript } from '../reducers/scripts'
import StoryHeader from '../components/StoryHeader'

import type { Episode } from '../reducers/episodes'
import type { Script, Scripts, IndexedScripts } from '../reducers/scripts'
import type { ReadState } from '../reducers/readStates'

class EpisodeDetail extends React.Component {
  constructor() {
    super()

    StatusBar.setHidden(true)
    this.state = {
      isLoading: true,
    }
  }

  static navigationOptions = ({ navigation }) => ({
    // title: 'Detail',
    header: (props) => {
      if (!navigation.state.params.visible) {
        return null
      }
      return <StoryHeader {...props} />
    },
  })

  componentDidMount() {
    const { novelId, episodeId } = this.props
    this.props.loadEpisode(novelId, episodeId).then(() => {
      this.props.pageView(novelId, episodeId)
      this.props.resetReadIndex(episodeId)
      this.setState({ isLoading: false })
    })
    this.props.loadNovelMetadata(novelId).then(action => {
      const { categoryId } = action.metadata
      this.props.loadRecommends(categoryId)
    })
    this.props.loadShareLinks(episodeId)
  }

  render() {
    const {
      episode, scripts, readState, paid, shareLinks,
      setHeaderVisible, onTapScreen, onTapPurchase,
    } = this.props

    if (this.state.isLoading) {
      return <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}></View>
    }
    return <Detail
      episode={ episode }
      scripts={ scripts }
      readState={ readState }
      paid={ paid }
      setHeaderVisible={ setHeaderVisible }
      shareLinks={ shareLinks }
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
    shareLinks: store.shareLinks[episodeId],
  }
}

const actions = (dispatch, props) => {
  return {
    loadEpisode: (novelId: number, episodeId: number) =>
      dispatch(loadEpisode(novelId, episodeId)),
    loadNovelMetadata: (novelId: number) =>
      dispatch(loadNovelMetadata(novelId)),
    loadRecommends: (categoryId: number) =>
      dispatch(loadRecommends(categoryId)),
    loadShareLinks: (episodeId: number) =>
      dispatch(loadShareLinks(episodeId)),
    onTapScreen: (episodeId: number) =>
      dispatch(updateReadState(episodeId)),
    onTapPurchase: () => dispatch(purchase()),
    setHeaderVisible: (visible: boolean) => {
      props.navigation.setParams({ visible })
    },
    resetReadIndex: (episodeId: number) => dispatch(updateReadState(episodeId, 0)),
    pageView: (novelId: number, episodeId: number) => dispatch(pageView(novelId, episodeId)),
  }
}

export default connect(select, actions)(EpisodeDetail)
