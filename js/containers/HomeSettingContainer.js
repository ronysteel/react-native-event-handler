// @flow
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modalbox'

import MenuIcon from '../components/MenuIcon'
import Setting from '../components/Setting'
import { closeSettingModal } from '../actions/homePage'

const HomeSettingContainer = ({ uid, closeModal, isOpen }) => (
  <Modal
    swipeToClose={ false }
    onClosed={ closeModal }
    isOpen={ isOpen }
    coverScreen={ true }
  >
    <Setting
      onTapClose={ closeModal }
      links={[
        {
          key: 0,
          title: 'お問い合わせ',
          url: `mailto:${encodeURIComponent(
            'chatnovel-info@newn.co?' +
            'subject=chatnovelについて&' +
            "body=\n\nUser ID: " + uid
          )}`,
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

const select = (store, props) => ({
  isOpen: store.pages.homePageState.isOpenSetting,
  uid: store.session.uid,
})

const actions = (dispatch, props) => ({
  closeModal: () => dispatch(closeSettingModal()),
})

export default connect(select, actions)(HomeSettingContainer)
