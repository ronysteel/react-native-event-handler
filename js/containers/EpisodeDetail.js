// @flow
import React from 'react'
import { Modal, StyleSheet, Text, View, StatusBar } from 'react-native'
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
import EpisodeList from './EpisodeList'

import type { Episode } from '../reducers/episodes'
import type { Script, Scripts, IndexedScripts } from '../reducers/scripts'
import type { ReadState } from '../reducers/readStates'

class EpisodeDetail extends React.Component {
  constructor() {
    super()

    StatusBar.setHidden(true)
    this.state = {
      isLoading: true,
      modalVisible: false,
      headerVisible: false,
    }
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
  })

  componentDidMount() {
    const { novelId, episodeId, navigation } = this.props
    navigation.setParams({ openModal: this.openModal })
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

  showHeader = () => {
    this.setState({ headerVisible: true })
  }

  hideHeader = () => {
    this.setState({ headerVisible: false })
  }

  openModal = () => {
    StatusBar.setHidden(false, true)
    this.setState({ modalVisible: true })
  }

  closeModal = () => {
    StatusBar.setHidden(true)
    this.setState({ modalVisible: false })
  }

  render() {
    const {
      novel, episode, scripts, readState, paid, shareLinks, recommends,
      navigation, setHeaderVisible, onTapScreen, onTapPurchase,
    } = this.props

    if (this.state.isLoading) {
      return <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}></View>
    }
    return (
      <View style={{ flex: 1 }}>
        <EpisodeList
          novelId={ novel.novelId }
          modalVisible={ this.state.modalVisible }
          closeModal={ this.closeModal }
        />
        <Detail
          novel={ novel }
          episode={ episode }
          scripts={ scripts }
          readState={ readState }
          paid={ paid }
          setHeaderVisible={ setHeaderVisible }
          shareLinks={ shareLinks }
          recommends={ recommends }
          openModal={ this.openModal }
          showHeader={ this.showHeader }
          hideHeader={ this.hideHeader }
          onTapScreen={ onTapScreen.bind(this, episode.id) }
          onTapPurchase={ onTapPurchase.bind(this) }
        />
        <StoryHeader
          visible={ this.state.headerVisible }
          navigation={ navigation }
          openModal={ this.openModal }
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
  const { episodeId, novelId } = getParams(props)

  const novel = store.novels[novelId]
  const episode: Episode = store.episodes[episodeId]
  const readState: ReadState = store.readStates[episodeId]
  const allScript: Scripts = getAllScript(store.episodes[episodeId], store.scripts)
  return {
    novelId,
    episodeId,
    episode,
    readState,
    allScript,
    novel,
    scripts: getScripts(allScript, readState),
    paid: store.session.paid,
    shareLinks: store.shareLinks[episodeId],
    recommends: store.recommends[novel.categoryId],
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
