// @flow
import React from 'react'
import {
  ImageBackground,
  View,
  StyleSheet,
} from 'react-native'

const BackgroundImage = ({ imageUrl, children }) => {
  if (!imageUrl) {
    return <View>{ children }</View>
  }

  return (
    <ImageBackground
      source={{ uri: imageUrl }}
      style={ styles.bg }
    >
      { children }
    </ImageBackground>
  )
}

const styles: StyleSheet = StyleSheet.create({
  bg: {
    flex: 1,
  },
})

export default BackgroundImage
