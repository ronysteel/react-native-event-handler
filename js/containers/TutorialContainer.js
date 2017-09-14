// @flow
import React from 'react'
import { Animated, StyleSheet, View, StatusBar } from 'react-native'
import { connect } from 'react-redux'

import Detail from '../components/EpisodeDetail'
import { loadEpisode, updateReadState, pageView } from '../actions/story'
import { tutorialEnd } from '../actions/user'
import {
  sendTutorialBeginEvent,
  sendTutorialCompleteEvent
} from '../actions/event'
import { getAllScript } from '../reducers/scripts'

import type { Episode } from '../reducers/episodes'
import type { Script, Scripts, IndexedScripts } from '../reducers/scripts'
import type { ReadState } from '../reducers/readStates'

class TutorialContainer extends React.Component {
  constructor () {
    super()

    this.state = {
      isLoading: true,
      fadeAnim: new Animated.Value(0),
      tutorialEnded: false
    }
  }

  componentDidMount () {
    const { novelId, episodeId, navigation, uid } = this.props
    StatusBar.setHidden(true)

    let categoryId
    Promise.all([
      this.props.loadEpisode(novelId, episodeId).then(() => {
        this.props.pageView(novelId, episodeId)
        this.props.resetReadIndex(episodeId)
      })
    ]).then(() => {
      this.setState({ isLoading: false })
      this.props.onTutorialStart(episodeId)
    })
  }

  componentWillUnmount () {
    StatusBar.setHidden(false)
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      this.props.readState &&
      this.props.readState.reachEndOfContent &&
      !prevProps.readState.reachEndOfContent
    ) {
      this.setState({ tutorialEnded: true })

      Animated.timing(this.state.fadeAnim, {
        toValue: 100,
        duration: 500
      }).start()

      setTimeout(() => {
        this.props.onTutorialEnd(this.props.episodeId)
      }, 1000)
    }
  }

  render () {
    const {
      novel,
      episode,
      scripts,
      readState,
      characters,
      uid,
      navigation,
      onTapScreen
    } = this.props

    if (this.state.isLoading) {
      return <View style={{ flex: 1, backgroundColor: '#f3f3f3' }} />
    }

    const color = this.state.fadeAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,1.0)']
    })

    return (
      <View style={{ flex: 1 }}>
        <Detail
          novel={novel}
          episode={episode}
          scripts={scripts}
          scriptValues={Object.values(scripts)}
          readState={readState}
          characters={characters}
          onTapScreen={onTapScreen.bind(this, uid, episode.id)}
          isTutorial={true}
          showHeader={() => {}}
          hideHeader={() => {}}
        />
        {this.state.tutorialEnded ? (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: color
            }}
          />
        ) : null}
      </View>
    )
  }
}

const getScripts = (
  scripts: IndexedScripts,
  readState: ReadState
): IndexedScripts => {
  return Object.keys(scripts).reduce((memo, k) => {
    if (readState && k <= readState.readIndex) {
      memo[k] = scripts[k]
    }
    return memo
  }, {})
}

const getParams = props => props.navigation.state.params

const select = (store, props) => {
  const { episodeId, novelId } = props

  const novel = store.novels[novelId]
  const episode: Episode = store.episodes[episodeId]
  const readState: ReadState = store.readStates[episodeId]
  const allScript: Scripts = getAllScript(
    store.episodes[episodeId],
    store.scripts
  )
  return {
    uid: store.session.uid,
    novelId,
    episodeId,
    episode,
    readState,
    allScript,
    novel,
    scripts: allScript,
    characters: store.characters[episodeId]
  }
}

const actions = (dispatch, props) => {
  return {
    loadEpisode: (novelId: number, episodeId: number) =>
      dispatch(loadEpisode(novelId, episodeId)),
    onTapScreen: (userId: number, episodeId: number) =>
      dispatch(updateReadState(episodeId)),
    resetReadIndex: (episodeId: number) =>
      dispatch(updateReadState(episodeId, 0)),
    pageView: (novelId: number, episodeId: number) =>
      dispatch(pageView(novelId, episodeId)),
    onTutorialStart: (episodeId: string) => {
      dispatch(sendTutorialBeginEvent(episodeId))
    },
    onTutorialEnd: (episodeId: string) =>
      dispatch(tutorialEnd()).then(() => {
        props.navigation.setParams({
          pushPopup: true,
          tutorial: false
        })
        dispatch(sendTutorialCompleteEvent(episodeId))
      })
  }
}

export default connect(select, actions)(TutorialContainer)
