// @flow
import React from 'react'
import { View, Text, AlertIOS, Linking } from 'react-native'
import { connect } from 'react-redux'

import Config from 'react-native-config'
import Share from 'react-native-share'
import Modal from 'react-native-modalbox'
import moment from 'moment'

import {
  purchase,
  restorePurchases,
  syncUserEnergy,
  useTicket,
  getTicket
} from '../actions/user'
import {
  sendPromotionEvent,
  sendPresentOfferEvnet,
  sendPromotionShareBeginEvnet,
  sendPromotionShareCompleteEvnet
} from '../actions/event'
import { closePromotionModal } from '../actions/storyPage'
import Promotion from '../components/Promotion'

const URL_SCHEME = Config.URL_SCHEME

class PromotionContainer extends React.Component {
  isOpen = props => {
    const { modalVisible, paid, readState, nextRechargeDate } = props
    let isOpen = modalVisible

    if (paid) {
      isOpen = false
    }

    if (!readState.displayPromotion) {
      isOpen = false
    }

    if (!nextRechargeDate || nextRechargeDate < moment().valueOf()) {
      isOpen = false
    }

    return isOpen
  }

  state = {
    isAvailableTwitter: false
  }

  tweetButtonAvailable = (
    ticketCount,
    remainingTweetCount,
    isAvailableTwitter
  ) => {
    if (ticketCount > 0) {
      return false
    }
    if (remainingTweetCount == 0) {
      return false
    }

    return isAvailableTwitter
  }

  componentDidMount () {
    Share.isAvailable('twitter')
      .then(() => {
        this.setState({ isAvailableTwitter: true })
      })
      .catch(() => {
        this.setState({ isAvailableTwitter: false })
      })
  }

  componentDidUpdate (prevProps, prevState) {
    const prevIsOpen = this.isOpen(prevProps)
    const isOpen = this.isOpen(this.props)

    if (prevIsOpen !== isOpen && isOpen === true) {
      this.props.sendPromotionEvent(
        this.tweetButtonAvailable(
          this.props.ticketCount,
          this.props.remainingTweetCount,
          this.state.isAvailableTwitter
        )
      )
    }
  }

  render () {
    const isOpen = this.isOpen(this.props)

    return (
      <Modal
        swipeToClose={false}
        onClosed={this.props.closeModal}
        isOpen={isOpen}
      >
        <Promotion
          products={this.props.purchasingProducts}
          ticketCount={this.props.ticketCount}
          remainingTweetCount={this.props.remainingTweetCount}
          isAvailableTwitter={this.state.isAvailableTwitter}
          onTapPurchase={this.props.onTapPurchase}
          onTapUseTicket={this.props.onTapUseTicket.bind(
            null,
            this.props.userId
          )}
          onTapGetTicket={this.props.onTapGetTicket.bind(
            null,
            this.props.userId,
            this.props.novel,
            this.props.shareLinks
          )}
          onTapRestore={this.props.onTapRestore}
          nextRechargeDate={this.props.nextRechargeDate}
          onEndRecharge={this.props.onEndRecharge.bind(null, this.props.userId)}
          closeModal={this.props.closeModal}
          onTapPrivacyPolicy={this.props.onTapPrivacyPolicy}
          onTapTermOfUse={this.props.onTapTermOfUse}
          onTapHelpPurchase={this.props.onTapHelpPurchase}
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
    novel,
    purchasingProducts,
    nextRechargeDate,
    paid: store.session.paid,
    modalVisible,
    ticketCount,
    remainingTweetCount,
    shareLinks: store.shareLinks[episodeId]
  }
}

const actions = (dispatch, props) => {
  const { episodeId } = props
  return {
    closeModal: () => dispatch(closePromotionModal(episodeId)),
    onTapPurchase: (productId: string) => dispatch(purchase(productId)),
    onEndRecharge: (userId: number) =>
      dispatch(closePromotionModal(episodeId)).then(() =>
        dispatch(syncUserEnergy(userId, true))
      ),
    onTapUseTicket: (userId: number) =>
      dispatch(closePromotionModal(episodeId))
        .then(() => dispatch(useTicket()))
        .then(() => dispatch(syncUserEnergy(userId, true))),
    onTapGetTicket: (userId: number, novel, shareLinks) =>
      Share.shareSingle({
        social: 'twitter',
        message: `無料で読める新感覚ノベルアプリCHAT NOVELで「${novel.title}」を読もう！ @CHATNOVEL`,
        url: shareLinks.default
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
        .catch(() => {}),
    onTapRestore: () =>
      dispatch(restorePurchases())
        .then(() => dispatch(closePromotionModal(episodeId)))
        .catch(() => {
          AlertIOS.alert('ストアエラー', '復元可能な購入が見つかりませんでした')
        }),
    sendPromotionEvent: (hasTweetButton: boolean) =>
      dispatch(sendPromotionEvent(episodeId, hasTweetButton)),
    onTapPrivacyPolicy: () => Linking.openURL(`${URL_SCHEME}://about/privacy`),
    onTapTermOfUse: () => Linking.openURL(`${URL_SCHEME}://about/terms`),
    onTapHelpPurchase: () =>
      Linking.openURL(`${URL_SCHEME}://about/subscription`)
  }
}

export default connect(select, actions)(PromotionContainer)
