// @flow
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modalbox'

import { loadEpisodeList } from '../actions/story'
import EpisodeListComponent from '../components/EpisodeList'
import { closeEpisodeListModal } from '../actions/storyPage'
import { getAllEpisode } from '../reducers/episodes'
import { onSelectContent } from './utils'

class EpisodeList extends React.PureComponent {
  constructor () {
    super()

    this.state = {
      isLoading: true
    }
  }

  componentDidMount () {
    const { novel } = this.props
    this.props.loadEpisodeList(novel.novelId).then(() => {
      this.setState({ isLoading: false })
    })
  }

  render () {
    const { closeModal, novel, episodes } = this.props
    return (
      <Modal
        swipeToClose={false}
        onClosed={closeModal}
        isOpen={this.props.isOpen}
      >
        {this.state.isLoading ? null : (
          <EpisodeListComponent
            novel={novel}
            episodes={episodes}
            closeModal={closeModal}
            onSelectContent={this.props.onSelectContent.bind(
              null,
              'episode_list'
            )}
          />
        )}
      </Modal>
    )
  }
}

const select = (store, props) => {
  const { novelId, episodeId } = props
  const novel = store.novels[novelId]
  const state = store.pages.storyPageStates[episodeId]
  return {
    novelId,
    novel,
    episodes: getAllEpisode(novel, store.episodes),
    isOpen: state && state.isOpenEpisodeList
  }
}

const actions = (dispatch, props) => {
  return {
    loadEpisodeList: (novelId: number) => dispatch(loadEpisodeList(novelId)),
    closeModal: () => dispatch(closeEpisodeListModal(props.episodeId)),
    onSelectContent: onSelectContent.bind(null, dispatch)
  }
}

export default connect(select, actions)(EpisodeList)
