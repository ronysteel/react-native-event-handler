// @flow
import React from 'react'
import {
  Image,
  View,
  StyleSheet,
} from 'react-native'

const BackgroundImage = ({ imageUrl, children }) => {
  if (!imageUrl) {
    return <View style={ styles.bg } />
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      style={ styles.bg }
    />
  )
}

const styles: StyleSheet = StyleSheet.create({
  bg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
})

export default BackgroundImage
