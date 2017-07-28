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
import {
  decreaseUserEnergy,
  syncUserEnergy,
} from '../actions/user'
import { getAllScript } from '../reducers/scripts'
import StoryHeader from '../components/StoryHeader'
import EpisodeList from './EpisodeList'

import type { Episode } from '../reducers/episodes'
import type { Script, Scripts, IndexedScripts } from '../reducers/scripts'
import type { ReadState } from '../reducers/readStates'

class EpisodeDetail extends React.Component {
  constructor() {
    super()

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
    const { novelId, episodeId, navigation, uid } = this.props
    navigation.setParams({ openModal: this.openModal })

    Promise.all([
      this.props.loadEpisode(novelId, episodeId).then(() => {
        this.props.pageView(novelId, episodeId)
        this.props.resetReadIndex(episodeId)
      }),
      this.props.loadNovelMetadata(novelId).then(action => {
        const { categoryId } = action.metadata
        this.props.loadRecommends(categoryId)
      }),
      this.props.loadShareLinks(episodeId),
      this.props.loadUserEnergy(uid),
    ]).then(() => {
      this.setState({ isLoading: false })
    })
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
      novel, episode, scripts, readState, shareLinks, recommends,
      uid, navigation, setHeaderVisible, onTapScreen,
    } = this.props

    if (this.state.isLoading) {
      return <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}></View>
    }

    return (
      <View style={{ flex: 1 }}>
        <Detail
          novel={ novel }
          episode={ episode }
          scripts={ scripts }
          scriptValues={ Object.values(scripts) }
          readState={ readState }
          setHeaderVisible={ setHeaderVisible }
          shareLinks={ shareLinks }
          recommends={ recommends }
          openModal={ this.openModal }
          showHeader={ this.showHeader }
          hideHeader={ this.hideHeader }
          onTapScreen={ onTapScreen.bind(this, uid, episode.id) }
        />
        <StoryHeader
          visible={ this.state.headerVisible }
          navigation={ navigation }
          openModal={ this.openModal }
        />
        <PromotionContainer episodeId={ episode.id } />
        <EpisodeList
          novelId={ novel.novelId }
          modalVisible={ this.state.modalVisible }
          closeModal={ this.closeModal }
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
    uid: store.session.uid,
    novelId,
    episodeId,
    episode,
    readState,
    allScript,
    novel,
    scripts: allScript,
    shareLinks: store.shareLinks[episodeId],
    recommends: novel && novel.categoryId && store.recommends[novel.categoryId],
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
    loadUserEnergy: (userId: number) =>
      dispatch(syncUserEnergy(userId, true)),
    onTapScreen: (userId: number, episodeId: number) => (
      dispatch(decreaseUserEnergy(userId))
        .then(() => dispatch(updateReadState(episodeId)))
        .then(() => dispatch(syncUserEnergy(userId)))
    ),
    setHeaderVisible: (visible: boolean) => {
      props.navigation.setParams({ visible })
    },
    resetReadIndex: (episodeId: number) => dispatch(updateReadState(episodeId, 0)),
    pageView: (novelId: number, episodeId: number) => dispatch(pageView(novelId, episodeId)),
  }
}

export default connect(select, actions)(EpisodeDetail)
