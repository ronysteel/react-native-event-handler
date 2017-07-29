// @flow
import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import Modal from 'react-native-modalbox'
import {
  purchase,
  syncUserEnergy,
} from '../actions/user'
import { closePromotionModal } from '../actions/storyPage'
import Promotion from '../components/Promotion'

class PromotionContainer extends React.Component {
  render() {
    let isOpen = this.props.modalVisible

    if (this.props.paid) {
      isOpen = false
    }

    if (!this.props.readState.displayPromotion) {
      isOpen = false
    }

    return (
      <Modal
        swipeToClose={ true }
        onClosed={ this.props.closeModal }
        isOpen={ isOpen }
      >
        <Promotion
          products={ this.props.purchasingProducts }
          onTapPurchase={ this.props.onTapPurchase }
          nextRechargeDate={ this.props.nextRechargeDate }
          onEndRecharge={ this.props.onEndRecharge.bind(null, this.props.userId) }
          closeModal={ this.props.closeModal }
        />
      </Modal>
    )
  }
}

const select = (store, props) => {
  const { episodeId } = props
  const readState: ReadState = store.readStates[episodeId]
  const nextRechargeDate = store.energy.nextRechargeDate
  const pageState = store.pages.storyPageStates[episodeId]
  const purchasingProducts = store.purchasingProducts
  const modalVisible = pageState && pageState.isOpenPromotion

  return {
    userId: store.session.uid,
    readState,
    purchasingProducts,
    nextRechargeDate,
    paid: store.session.paid,
    modalVisible,
  }
}

const actions = (dispatch, props) => {
  const { episodeId } = props
  return {
    closeModal: () => dispatch(closePromotionModal(episodeId)),
    onTapPurchase: () => dispatch(purchase()),
    onEndRecharge: (userId: number) => (
      dispatch(syncUserEnergy(userId, true))
        .then(() => dispatch(closePromotionModal(episodeId)))
    )
  }
}

export default connect(select, actions)(PromotionContainer)
