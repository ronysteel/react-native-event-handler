// @flow
import React from 'react'
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native'

import ChatBubbleTail from './ChatBubbleTail'

const SCREEN_WIDTH = Dimensions.get('window').width
const MAX_IMAGE_HEIGHT = 400

const calcImageSize = image => {
  const w = image.imageWidth
  const h = image.imageHeight

  if (h <= w) {
    const ratio = h / w
    return {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * ratio,
    }
  } else {
    const ratio = w / h

    if (h < MAX_IMAGE_HEIGHT) {
      return { width: w, height: h }
    } else {
      return {
        width: MAX_IMAGE_HEIGHT * ratio,
        height: MAX_IMAGE_HEIGHT,
      }
    }
  }
}

//
// NORMAL
//

const renderNormal = image => (
  <View style={ styles.normal.row }>
    <Image
      style={ [styles.normal.image, calcImageSize(image)] }
      source={{ uri: image.imageUrl }}
    />
  </View>
)

//
// CHAT_LEFT
//

const renderChatLeft = (image, character) => (
  <View style={ styles.chatLeft.container }>
    { character.avatarUrl
      ? <Image source={{ uri: character.avatarUrl }} style={ styles.chatLeft.avatarImage }/>
      : null
    }
    <View style={ styles.chatLeft.row }>
      <Image
        style={ [styles.chatLeft.image] }
        source={{ uri: image.imageUrl }}
      />
    </View>
  </View>
)

//
// CHAT_RIGHT
//

const renderChatRight = image => (
  <View style={ styles.chatRight.row }>
    <Image
      style={ [styles.chatRight.image] }
      source={{ uri: image.imageUrl }}
    />
  </View>
)

const getImageComponent = (image, character) => {
  switch (image.type) {
    case 'NORMAL': {
      return renderNormal(image)
    }
    case 'CHAT_LEFT': {
      return renderChatLeft(image, character)
    }
    case 'CHAT_RIGHT': {
      return renderChatRight(image)
    }
    default: {
      return null
    }
  }
}

const ScriptImage = ({ image, characters, isLatestItem }) => {
  let character
  if (image.characterId && characters[image.characterId]) {
    character = characters[image.characterId]
  }
  return getImageComponent(image, character)
}

const styles = {
  normal: StyleSheet.create({
    row: {
      flex: 1,
      marginTop: 30,
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    image: {
      alignSelf: 'center',
    },
  }),
  chatLeft: StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      marginHorizontal: 15,
      marginTop: 20,
    },
    row: {
      marginLeft: 5,
      borderRadius: 17,
      backgroundColor: 'transparent',
    },
    image: {
      width: 247,
      height: 247,
      borderRadius: 17,
      resizeMode: 'cover',
    },
    avatarImage: {
      width: 34,
      height: 34,
      marginRight: 10,
      borderRadius: 34 / 2,
    },
  }),
  chatRight: StyleSheet.create({
    row: {
      alignSelf: 'flex-end',
      marginTop: 20,
      marginRight: 15,
      marginBottom: 0,
      borderRadius: 17,
      backgroundColor: 'transparent',
    },
    image: {
      width: 247,
      height: 247,
      borderRadius: 17,
      resizeMode: 'cover',
    },
  }),
}

export default ScriptImage
