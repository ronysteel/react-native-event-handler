// @flow
import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import { purchase } from '../actions/user'
import Promotion from '../components/Promotion'

class PromotionContainer extends React.Component {
  render() {
    const { paid, readState, onTapPurchase } = this.props
    return (
      <Promotion
        paid={ paid }
        readState={ readState }
        onTapPurchase={ onTapPurchase }
      />
    )
  }
}

const select = (store, props) => {
  const { episodeId } = props
  const readState: ReadState = store.readStates[episodeId]
  return {
    readState,
    paid: store.session.paid,
  }
}

const actions = (dispatch, props) => {
  return {
    onTapPurchase: () => dispatch(purchase()),
  }
}

export default connect(select, actions)(PromotionContainer)
