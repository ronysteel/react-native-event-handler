// @flow
import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

const BaseIcon = ({ style, onPress, bgColor, children }) => (
  <TouchableOpacity onPress={ onPress }>
    <View style={ [ styles.container, { backgroundColor: bgColor }, style ] }>
      <View style={ styles.wrapper }>
        { children }
      </View>
    </View>
  </TouchableOpacity>
)

const styles: StyleSheet = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 48,
    justifyContent: 'center',
  },
  wrapper: {
    alignSelf: 'center',
  },
})

export default BaseIcon
