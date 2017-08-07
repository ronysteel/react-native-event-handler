// @flow
import React from 'react'
import { View, Text, AlertIOS } from 'react-native'
import { connect } from 'react-redux'

import Share from 'react-native-share'
import Modal from 'react-native-modalbox'
import {
  purchase,
  restorePurchases,
  syncUserEnergy,
  useTicket,
  getTicket,
} from '../actions/user'
import {
  sendPromotionEvent,
  sendPresentOfferEvnet,
  sendPromotionShareBeginEvnet,
  sendPromotionShareCompleteEvnet,
} from '../actions/event'
import { closePromotionModal } from '../actions/storyPage'
import Promotion from '../components/Promotion'

class PromotionContainer extends React.Component {
  isOpen = (props) => {
    const { modalVisible, paid, readState } = props
    let isOpen = modalVisible

    if (paid) {
      isOpen = false
    }

    if (!readState.displayPromotion) {
      isOpen = false
    }

    return isOpen
  }

  state = {
    isAvailableTwitter: false
  }

  componentDidMount() {
    Share.isAvailable('twitter')
      .then(() => {
        this.setState({ isAvailableTwitter: true })
      })
      .catch(() => {
        this.setState({ isAvailableTwitter: false })
      })
  }

  componentDidUpdate(prevProps, prevState) {
    const prevIsOpen = this.isOpen(prevProps)
    const isOpen = this.isOpen(this.props)

    if (prevIsOpen !== isOpen && isOpen === true) {
    }
  }

  render() {
    const isOpen = this.isOpen(this.props)

    return (
      <Modal
        swipeToClose={ false }
        onClosed={ this.props.closeModal }
        isOpen={ isOpen }
      >
        <Promotion
          products={ this.props.purchasingProducts }
          ticketCount={ this.props.ticketCount }
          remainingTweetCount={ this.props.remainingTweetCount }
          isAvailableTwitter={ this.state.isAvailableTwitter }
          onTapPurchase={ this.props.onTapPurchase }
          onTapUseTicket={ this.props.onTapUseTicket.bind(null, this.props.userId) }
          onTapGetTicket={ this.props.onTapGetTicket.bind(null, this.props.userId, this.props.novel, this.props.shareLinks) }
          onTapRestore={ this.props.onTapRestore }
          nextRechargeDate={ this.props.nextRechargeDate }
          onEndRecharge={ this.props.onEndRecharge.bind(null, this.props.userId) }
          closeModal={ this.props.closeModal }
        />
      </Modal>
    )
  }
}

const select = (store, props) => {
  const { novelId, episodeId } = props
  const novel = store.novels[novelId]
  const readState: ReadState = store.readStates[episodeId]
  const nextRechargeDate = store.energy.nextRechargeDate
  const pageState = store.pages.storyPageStates[episodeId]
  const purchasingProducts = store.purchasingProducts
  const modalVisible = pageState && pageState.isOpenPromotion
  const ticketCount = store.tickets.ticketCount
  const remainingTweetCount = store.tweets.remainingTweetCount

  return {
    userId: store.session.uid,
    readState,
    purchasingProducts,
    nextRechargeDate,
    paid: store.session.paid,
    modalVisible,
    ticketCount,
    remainingTweetCount,
    shareLinks: store.shareLinks[episodeId],
  }
}

const actions = (dispatch, props) => {
  const { episodeId } = props
  return {
    closeModal: () => dispatch(closePromotionModal(episodeId)),
    onTapPurchase: (productId: string) => dispatch(purchase(productId)),
    onEndRecharge: (userId: number) => (
      dispatch(closePromotionModal(episodeId))
        .then(() => dispatch(syncUserEnergy(userId, true)))
    ),
    onTapUseTicket: (userId: number) => (
      dispatch(closePromotionModal(episodeId))
        .then(() => dispatch(useTicket()))
        .then(() => dispatch(syncUserEnergy(userId, true)))
    ),
    onTapGetTicket: (userId: number, novel, shareLinks) => (
      Share
        .shareSingle({
          social: 'twitter',
          title: novel.title,
          url: shareLinks.default,
        })
        .then(({ shared }) => {
          dispatch(sendPromotionShareBeginEvnet(episodeId))

          if (!shared) {
            return
          }

          dispatch(sendPromotionShareCompleteEvnet(episodeId))

          return dispatch(getTicket())
            .then(() => dispatch(syncUserEnergy(userId, true)))
            .then(() => dispatch(sendPresentOfferEvnet()))
        })
        .catch(() => {})
    ),
    onTapRestore: () => (
      dispatch(restorePurchases())
        .then(() => dispatch(closePromotionModal(episodeId)))
        .catch(() => {
          AlertIOS.alert(
            'ストアエラー',
            '購入の復元に失敗しました'
          )
        })
    ),
    sendPromotionEvent: () => (
      dispatch(sendPromotionEvent(episodeId))
    ),
  }
}

export default connect(select, actions)(PromotionContainer)
