// @flow
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import MenuIcon from '../components/MenuIcon'
import { openSettingModal } from '../actions/homePage'

class HomeHeaderLeft extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={ this.props.openSettingModal }>
        <View style={ styles.headerLeftWrapper }>
          <MenuIcon />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  headerLeftWrapper: {
    padding: 15,
  },
})

const select = (store, props) => ({})
const actions = (dispatch, props) => ({
  openSettingModal: () => dispatch(openSettingModal())
})

export default connect(select, actions)(HomeHeaderLeft)
