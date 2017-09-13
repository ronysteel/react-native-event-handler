// @flow
import React from 'react'
import { Modal, StyleSheet, Text, View, Linking, StatusBar } from 'react-native'
import { connect } from 'react-redux'

import Detail from '../components/EpisodeDetail'

import {
  loadEpisode,
  loadEpisodeList,
  loadRecommends,
  updateReadState,
  pageView,
  completeContent,
} from '../actions/story'
import {
  decreaseUserEnergy,
  syncUserEnergy,
} from '../actions/user'
import {
  openPromotionModal,
  openEpisodeListModal,
} from '../actions/storyPage'
import {
  sendSelectContentEvent,
  sendShareEvent,
  sendShareCompleteEvent,
} from '../actions/event'

import { getAllScript } from '../reducers/scripts'
import { getNextEpisode } from '../reducers/episodes'
import StoryHeader from '../components/StoryHeader'
import EpisodeList from './EpisodeList'
import PromotionContainer from './PromotionContainer'
import { onSelectContent, onPressShare } from './utils'

import type { Episode } from '../reducers/episodes'
import type { Script, Scripts, IndexedScripts } from '../reducers/scripts'
import type { ReadState } from '../reducers/readStates'

class EpisodeDetail extends React.PureComponent {
  constructor() {
    super()

    this.state = {
      isLoading: true,
      headerVisible: false,
      tapping: false,
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
          if (!this.props.readState || (this.props.readState && this.props.readState.reachEndOfContent)) {
            this.props.resetReadIndex(episodeId)
          }
        }),
      this.props.loadUserEnergy(uid),
      this.props.loadEpisodeList(novelId),
    ])
      .then(() => {
        this.setState({ isLoading: false })
      })
      .then(() => {
        this.props.loadRecommends(this.props.novel.categoryId)
        this.props.onStartReading(novelId, episodeId)
      })
      .catch(err => {
        console.error(err)
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
      novel, episode, scripts, readState, shareLinks,
      characters, uid, navigation, setHeaderVisible, onTapScreen,
    } = this.props

    if (this.state.isLoading) {
      return <View style={{ flex: 1, backgroundColor: '#fff' }}></View>
    }

    return (
      <View style={{ flex: 1 }}>
        <Detail
          novel={ novel }
          episode={ episode }
          nextEpisode={ this.props.nextEpisode }
          scripts={ scripts }
          scriptValues={ Object.values(scripts) }
          readState={ readState }
          characters={ characters }
          setHeaderVisible={ setHeaderVisible }
          shareLinks={ shareLinks }
          category={ this.props.category }
          recommends={ this.props.recommends }
          showHeader={ this.showHeader }
          hideHeader={ this.hideHeader }
          onTapScreen={ onTapScreen.bind(null, this, uid, episode.id) }
          onSelectContent={ this.props.onSelectContent }
          onPressShare={ this.props.onPressShare.bind(null, episode.id) }
        />
        <StoryHeader
          visible={ this.state.headerVisible }
          navigation={ navigation }
          openModal={ this.props.openEpisodeListModal.bind(null, episode.id) }
        />
        <PromotionContainer novelId={ novel.novelId } episodeId={ episode.id } />
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
    nextEpisode: getNextEpisode(novel, episode, store.episodes),
    readState,
    allScript,
    novel,
    scripts: allScript,
    characters: store.characters[episodeId],
    shareLinks: store.shareLinks[episodeId],
    recommends: novel && novel.categoryId && store.recommends[novel.categoryId],
    category: novel && novel.categoryId && store.categories[novel.categoryId],
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
    loadEpisodeList: (novelId: string) => dispatch(loadEpisodeList(novelId)),
    onTapScreen: (obj: EpisodeDetail, userId: number, episodeId: number) => {
      if (obj.state.tapping) {
        return
      }
      obj.state.tapping = true
      return dispatch(updateReadState(episodeId))
        .then(() => dispatch(syncUserEnergy(userId)))
        .then(() => dispatch(decreaseUserEnergy(userId)))
        .then(() => dispatch(openPromotionModal(episodeId)))
        .then(() => dispatch(completeContent(episodeId)))
        .then(() => obj.state.tapping = false)
        .catch(() => obj.state.tapping = false)
    },
    setHeaderVisible: (visible: boolean) => {
      props.navigation.setParams({ visible })
    },
    resetReadIndex: (episodeId: number) => dispatch(updateReadState(episodeId, 0)),
    pageView: (novelId: number, episodeId: number) => dispatch(pageView(novelId, episodeId)),
    openEpisodeListModal: (episodeId: number) => dispatch(openEpisodeListModal(episodeId)),
    onStartReading: (novelId: number, episodeId: number) => {
      dispatch(sendSelectContentEvent(novelId, episodeId))
    },
    onSelectContent: onSelectContent.bind(null, dispatch),
    onPressShare: (episodeId: number, type: string, options) => {
      const p = onPressShare(type, options)
      if (type == 'twitter' || type == 'facebook') {
        p.then(({ shared }) => {
          if (shared) {
            dispatch(sendShareCompleteEvent(episodeId, type))
          }
        })
      }
      dispatch(sendShareEvent(episodeId, type))
    },
  }
}

export default connect(select, actions)(EpisodeDetail)
