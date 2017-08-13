// @flow
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modalbox'

import MenuIcon from '../components/MenuIcon'
import Setting from '../components/Setting'
import { closeSettingModal } from '../actions/homePage'
import { loadTicketCount } from '../actions/app'

class HomeSettingContainer extends React.PureComponent {
  state = {
    ticketCountLoaded: false
  }

  componentDidMount() {
    this.props.loadTicketCount()
      .then(() => {
        this.setState({ ticketCountLoaded: true })
      })
  }

  render() {
    const { uid, closeModal, isOpen } = this.props

    return (
      <Modal
        swipeToClose={ false }
        onClosed={ closeModal }
        isOpen={ isOpen }
        coverScreen={ true }
      >
        <Setting
          onTapClose={ closeModal }
          ticketCount={{
            key: 0,
            title: '持っているチケット',
            ticketCount: this.props.ticketCount || 0,
          }}
          links={[
            {
              key: 0,
              title: 'お問い合わせ',
              url: `mailto:chatnovel-info@newn.co?` +
                `subject=chatnovelについて&` +
                `body=\n\nUser ID: ${uid}`,
            },
            {
              key: 1,
              title: '利用規約',
              url: 'http://newn.co/terms.html',
            },
            {
              key: 2,
              title: 'プライバシーポリシー',
              url: 'http://newn.co/privacy.html',
            },
          ]}
        />
      </Modal>
    )
  }
}

const select = (store, props) => ({
  isOpen: store.pages.homePageState.isOpenSetting,
  uid: store.session.uid,
  ticketCount: store.tickets.ticketCount,
})

const actions = (dispatch, props) => ({
  closeModal: () => dispatch(closeSettingModal()),
  loadTicketCount: () => dispatch(loadTicketCount()),
})

export default connect(select, actions)(HomeSettingContainer)
