// @flow
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modalbox'

import { loadEpisodeList } from '../actions/story'
import EpisodeListComponent from '../components/EpisodeList'
import { closeEpisodeListModal } from '../actions/storyPage'

class EpisodeList extends React.PureComponent {
  constructor() {
    super()

    this.state = {
      isLoading: true,
    }
  }

  componentDidMount() {
    const { novel } = this.props
    this.props.loadEpisodeList(novel.novelId).then(() => {
      this.setState({ isLoading: false })
    })
  }

  render() {
    const { closeModal, novel, episodes } = this.props
    return (
      <Modal
        swipeToClose={ true }
        onClosed={ closeModal }
        isOpen={ this.props.isOpen }
      >
        { this.state.isLoading
          ? null
          : <EpisodeListComponent
              novel={ novel }
              episodes={ episodes }
              closeModal={ closeModal }
            />
        }
      </Modal>
    )
  }
}

const getAllEpisode = (novel, episodes) => {
  if (!novel || !novel.episodeIds) {
    return []
  }

  return novel.episodeIds.reduce((memo, id) => {
    memo.push(episodes[id])
    return memo
  }, [])
}

const select = (store, props) => {
  const { novelId, episodeId } = props
  const novel = store.novels[novelId]
  const state = store.pages.storyPageStates[episodeId]
  return {
    novelId,
    novel,
    episodes: getAllEpisode(novel, store.episodes),
    isOpen: state && state.isOpenEpisodeList,
  }
}

const actions = (dispatch, props) => {
  return {
    loadEpisodeList: (novelId: number) => dispatch(loadEpisodeList(novelId)),
    closeModal: () => dispatch(closeEpisodeListModal(props.episodeId))
  }
}

export default connect(select, actions)(EpisodeList)
