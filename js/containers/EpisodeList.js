// @flow
import React from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modalbox';

import { loadEpisodeList } from '../actions/story'
import EpisodeListComponent from '../components/EpisodeList'

class EpisodeList extends React.PureComponent {
  constructor() {
    super()

    this.state = {
      isLoading: true,
    }
  }

  componentDidMount() {
    const { novelId, novel } = this.props
    this.props.loadEpisodeList(novelId).then(() => {
      this.setState({ isLoading: false })
    })
  }

  render() {
    const { modalVisible, closeModal, novel, episodes } = this.props
    return (
      <Modal
        swipeToClose={ true }
        onClosed={ closeModal }
        isOpen={ modalVisible }
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

const getAllEpisode = (novel, episodes) => (
  novel.episodeIds.reduce((memo, id) => {
    memo.push(episodes[id])
    return memo
  }, [])
)

const select = (store, props) => {
  const { novelId } = props
  const novel = store.novels[novelId]
  return {
    novelId,
    novel,
    episodes: getAllEpisode(novel, store.episodes),
  }
}

const actions = (dispatch, props) => {
  return {
    loadEpisodeList: (novelId: number) => dispatch(loadEpisodeList(novelId)),
  }
}

export default connect(select, actions)(EpisodeList)
