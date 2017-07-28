// @flow
import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import Modal from 'react-native-modalbox'
import { purchase } from '../actions/user'
import { closePromotionModal } from '../actions/storyPage'
import Promotion from '../components/Promotion'

class PromotionContainer extends React.Component {
  render() {
    const { paid, readState, onTapPurchase } = this.props

    return (
      <Modal
        swipeToClose={ true }
        onClosed={ this.props.closeModal }
        isOpen={ this.props.modalVisible }
      >
        <Promotion
          paid={ paid }
          readState={ readState }
          onTapPurchase={ onTapPurchase }
        />
      </Modal>
    )
  }
}

const select = (store, props) => {
  const { episodeId } = props
  const readState: ReadState = store.readStates[episodeId]
  const pageState = store.pages.storyPageStates[episodeId]
  return {
    readState,
    paid: store.session.paid,
    modalVisible: pageState && pageState.isOpenPromotion,
  }
}

const actions = (dispatch, props) => {
  const { episodeId } = props
  return {
    closeModal: () => dispatch(closePromotionModal(episodeId)),
    onTapPurchase: () => dispatch(purchase()),
  }
}

export default connect(select, actions)(PromotionContainer)
