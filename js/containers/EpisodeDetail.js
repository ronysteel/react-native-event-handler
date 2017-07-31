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
import {
  openPromotionModal,
  openEpisodeListModal,
} from '../actions/storyPage'
import { getAllScript } from '../reducers/scripts'
import StoryHeader from '../components/StoryHeader'
import EpisodeList from './EpisodeList'
import PromotionContainer from './PromotionContainer'

import type { Episode } from '../reducers/episodes'
import type { Script, Scripts, IndexedScripts } from '../reducers/scripts'
import type { ReadState } from '../reducers/readStates'

class EpisodeDetail extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoading: true,
      headerVisible: false,
    }
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
  })

  componentDidMount() {
    const { novelId, episodeId, navigation, uid } = this.props

    let categoryId
    Promise.all([
      this.props.loadEpisode(novelId, episodeId)
        .then(() => {
          this.props.pageView(novelId, episodeId)
          this.props.resetReadIndex(episodeId)
        }),
      this.props.loadUserEnergy(uid),
    ])
      .then(() => {
        this.setState({ isLoading: false })
      })
      .then(() => {
        this.props.loadRecommends(1)
      })
  }

  showHeader = () => {
    this.setState({ headerVisible: true })
  }

  hideHeader = () => {
    this.setState({ headerVisible: false })
  }

  render() {
    const {
      novel, episode, scripts, readState, shareLinks, recommends,
      uid, navigation, setHeaderVisible, onTapScreen,
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
          setHeaderVisible={ setHeaderVisible }
          shareLinks={ shareLinks }
          recommends={ recommends }
          showHeader={ this.showHeader }
          hideHeader={ this.hideHeader }
          onTapScreen={ onTapScreen.bind(this, uid, episode.id) }
        />
        <StoryHeader
          visible={ this.state.headerVisible }
          navigation={ navigation }
          openModal={ this.props.openEpisodeListModal.bind(null, episode.id) }
        />
        <PromotionContainer episodeId={ episode.id } />
        <EpisodeList
          novelId={ novel.novelId }
          episodeId={ episode.id }
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
    loadRecommends: (categoryId: number) =>
      dispatch(loadRecommends(categoryId)),
    loadUserEnergy: (userId: number) =>
      dispatch(syncUserEnergy(userId, true)),
    onTapScreen: (userId: number, episodeId: number) => (
      dispatch(decreaseUserEnergy(userId))
        .then(() => dispatch(syncUserEnergy(userId)))
        .then(() => dispatch(updateReadState(episodeId)))
        .then(() => dispatch(openPromotionModal(episodeId)))
    ),
    setHeaderVisible: (visible: boolean) => {
      props.navigation.setParams({ visible })
    },
    resetReadIndex: (episodeId: number) => dispatch(updateReadState(episodeId, 0)),
    pageView: (novelId: number, episodeId: number) => dispatch(pageView(novelId, episodeId)),
    openEpisodeListModal: (episodeId: number) => dispatch(openEpisodeListModal(episodeId)),
  }
}

export default connect(select, actions)(EpisodeDetail)
