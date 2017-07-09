// @flow
import React from 'react'
import {
  Image,
  View,
  StyleSheet,
} from 'react-native'

const BackgroundImage = ({ imageUrl, children }) => {
  if (!imageUrl) {
    return <View>{ children }</View>
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      style={ styles.bg }
    >
      { children }
    </Image>
  )
}

const styles: StyleSheet = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: 'cover',
  },
})

export default BackgroundImage
