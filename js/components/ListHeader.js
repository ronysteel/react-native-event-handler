// @flow
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'

import CloseIcon from './CloseIcon'

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0
const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 56

const ListHeader = ({ title, closeModal }) => {
  return (
    <View style={ styles.container }>
      <View style={ styles.header}>
        <View style={ styles.left }>
          <TouchableOpacity onPress={ closeModal }>
            <View style={ styles.close }>
              <CloseIcon color={ '#fff' } />
            </View>
          </TouchableOpacity>
        </View>
        <View style={ styles.title }>
          <Text style={ styles.titleText }>{ title }</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    height: APPBAR_HEIGHT + STATUSBAR_HEIGHT,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flex: 1,
  },
  left: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  title: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 64,
    right: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  close: {
    padding: 15,
  },
})

export default ListHeader
