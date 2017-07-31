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

const renderChatLeft = text => (
  <View style={ styles.chatLeft.container }>
    { text.charactor.avatarUrl
      ? <Image source={{ uri: text.charactor.avatarUrl }} style={ styles.chatLeft.avatarImage }/>
      : null
    }
    <View style={ styles.chatLeft.row }>
      <View style={ styles.chatLeft.chatBubbleTail }>
        <ChatBubbleTail color={ '#f0f0f0' } direction={ 'LEFT' } />
      </View>
      { renderChatLeftCharactorName(text) }
      <Text style={ styles.chatLeft.text }>{ text.body }</Text>
    </View>
  </View>
)

const renderChatLeftCharactorName = text => {
  if (text.charactor) {
    return <Text style={ styles.chatLeft.charactor }>{ text.charactor.name }</Text>
  }
  return null
}

//
// CHAT_RIGHT
//

const renderChatRight = text => (
  <View style={ styles.chatRight.row }>
    <View style={ styles.chatRight.chatBubbleTail }>
      <ChatBubbleTail color={ '#9de05b' } direction={ 'RIGHT' } />
    </View>
    <Text style={ styles.chatRight.text }>{ text.body }</Text>
  </View>
)

const getImageComponent = (image) => {
  switch (image.type) {
    case 'NORMAL': {
      return renderNormal(image)
    }
    case 'CHAT_LEFT': {
      return null
    }
    case 'CHAT_RIGHT': {
      return null
    }
    default: {
      return null
    }
  }
}

const ScriptImage = ({ image, isLatestItem }) => {
  return getImageComponent(image)
}

const styles = {
  normal: StyleSheet.create({
    row: {
      flex: 1,
      marginTop: 20,
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    image: {
      alignSelf: 'center',
    },
    charactor: {
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 2,
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
      maxWidth: 224,
      marginLeft: 5,
      marginBottom: 0,
      borderRadius: 17,
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderWidth: 0.5,
      borderColor: '#d8d8d8',
    },
    text: {
      fontSize: 16,
      lineHeight: 16 + 6,
    },
    charactor: {
      color: '#737373',
      fontSize: 11,
      marginBottom: 6,
    },
    avatarImage: {
      width: 34,
      height: 34,
      marginRight: 10,
      borderRadius: 34 / 2,
    },
    chatBubbleTail: {
      position: 'absolute',
      top: 0,
      left: -4,
    },
  }),
  chatRight: StyleSheet.create({
    row: {
      alignSelf: 'flex-end',
      maxWidth: 224,
      margin: 20,
      marginBottom: 0,
      borderRadius: 17,
      backgroundColor: '#9de05b',
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    text: {
      fontSize: 16,
      lineHeight: 16 + 6,
    },
    chatBubbleTail: {
      position: 'absolute',
      top: 0,
      right: -4,
    },
  }),
}

export default ScriptImage
