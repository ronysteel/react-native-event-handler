// @flow
import React from 'react'
import { Platform, View, Text, AlertIOS, Linking } from 'react-native'
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

import type { Novel, ReadState, ShareLink } from '../reducers/types'

const URL_SCHEME = Config.URL_SCHEME

type Props = {
  ...$Exact<Selects>,
  ...$Exact<Actions>
}

type State = {
  isAvailableTwitter: boolean
}

class PromotionContainer extends React.Component<void, Props, State> {
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
    // Share#isAvailable is not supporeted on android.
    // And android can handle URL whether twitter app is installed or not
    if (Platform.OS === 'android') {
      this.setState({ isAvailableTwitter: true })
    } else {
      Share.isAvailable('twitter')
        .then(() => {
          this.setState({ isAvailableTwitter: true })
        })
        .catch(() => {
          this.setState({ isAvailableTwitter: false })
        })
    }
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

type Selects = {
  userId: string,
  readState: ReadState,
  novel: Novel,
  nextRechargeDate: number,
  paid: boolean,
  modalVisible: boolean,
  ticketCount: number,
  remainingTweetCount: number,
  shareLinks: ShareLink
}

const select = (store, props): Selects => {
  const { novelId, episodeId } = props
  const novel = store.novels[novelId]
  const readState: ReadState = store.readStates[episodeId]
  const nextRechargeDate = store.energy.nextRechargeDate
  const pageState = store.pages.storyPageStates[episodeId]
  const modalVisible = pageState && pageState.isOpenPromotion
  const ticketCount = store.tickets.ticketCount
  const remainingTweetCount = store.tweets.remainingTweetCount

  return {
    userId: store.session.uid,
    readState,
    novel,
    nextRechargeDate,
    paid: store.session.paid,
    modalVisible,
    ticketCount,
    remainingTweetCount,
    shareLinks: store.shareLinks[episodeId]
  }
}

type Actions = {
  closeModal: Function,
  onTapPurchase: Function,
  onEndRecharge: Function,
  onTapUseTicket: Function,
  onTapGetTicket: Function,
  onTapRestore: Function,
  sendPromotionEvent: Function,
  onTapPrivacyPolicy: Function,
  onTapTermOfUse: Function,
  onTapHelpPurchase: Function
}

const actions = (dispatch, props): Actions => {
  const { episodeId } = props
  return {
    closeModal: () => dispatch(closePromotionModal(episodeId)),
    onTapPurchase: (productId: string) => dispatch(purchase(productId)),
    onEndRecharge: (userId: string) =>
      dispatch(closePromotionModal(episodeId)).then(() =>
        dispatch(syncUserEnergy(userId, true))
      ),
    onTapUseTicket: (userId: string) =>
      dispatch(closePromotionModal(episodeId))
        .then(() => dispatch(useTicket()))
        .then(() => dispatch(syncUserEnergy(userId, true))),
    onTapGetTicket: (userId: string, novel, shareLinks) =>
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
