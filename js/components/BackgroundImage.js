// @flow
import React from 'react'
import {
  Image,
  View,
  StyleSheet,
} from 'react-native'
import FadeIn from 'react-native-fade-in-image'

const BackgroundImage = ({ imageUrl, children }) => {
  if (!imageUrl) {
    return <View style={ styles.bg } />
  }

  return (
    <FadeIn style={ styles.bg } duration={ 200 } placeholderStyle={ styles.placeholderStyle }>
      <Image
        source={{ uri: imageUrl }}
        style={ styles.bg }
      />
    </FadeIn>
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
  placeholderStyle: {
    backgroundColor: '#fff',
  }
})

export default BackgroundImage
