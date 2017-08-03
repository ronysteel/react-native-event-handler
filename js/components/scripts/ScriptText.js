// @flow
import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

import ChatBubbleTail from './ChatBubbleTail'

//
// NORMAL
//

const renderNormalText = (text, character) => (
  <View style={ styles.normal.row }>
    { renderNormalCharacterName(character) }
    <Text style={ styles.normal.text }>{ text.body }</Text>
  </View>
)

const renderNormalCharacterName = character => {
  if (character) {
    const color = { color: "#0F8986" }
    if (character.color) {
      color.color = character.color
    }
    return <Text style={ [styles.normal.character, color] }>{ character.name }</Text>
  }
  return null
}

//
// CHAT_LEFT
//

const renderChatLeft = (text, character) => (
  <View style={ styles.chatLeft.container }>
    { character.avatarUrl
      ? <Image source={{ uri: character.avatarUrl }} style={ styles.chatLeft.avatarImage }/>
      : null
    }
    <View style={ styles.chatLeft.rowWrapper }>
      <View style={ styles.chatLeft.row }>
        <View style={ styles.chatLeft.chatBubbleTail }>
          <ChatBubbleTail color={ '#f0f0f0' } direction={ 'LEFT' } />
        </View>
        { renderChatLeftCharacterName(character) }
        <Text style={ styles.chatLeft.text }>{ text.body }</Text>
      </View>
    </View>
  </View>
)

const renderChatLeftCharacterName = character => {
  if (character) {
    return <Text style={ styles.chatLeft.character }>{ character.name }</Text>
  }
  return null
}

//
// CHAT_RIGHT
//

const renderChatRight = (text, character) => (
  <View style={ styles.chatRight.row }>
    <View style={ styles.chatRight.chatBubbleTail }>
      <ChatBubbleTail color={ '#9de05b' } direction={ 'RIGHT' } />
    </View>
    { renderChatRightCharacterName(character) }
    <Text style={ styles.chatRight.text }>{ text.body }</Text>
  </View>
)

const renderChatRightCharacterName = character => {
  if (character) {
    return <Text style={ styles.chatRight.character }>{ character.name }</Text>
  }
  return null
}

const getTextComponent = (text, character) => {
  switch (text.type) {
    case 'NORMAL': {
      return renderNormalText(text, character)
    }
    case 'CHAT_LEFT': {
      return renderChatLeft(text, character)
    }
    case 'CHAT_RIGHT': {
      return renderChatRight(text, character)
    }
    default: {
      return null
    }
  }
}

const ScriptText = ({ text, characters, isLatestItem }) => {
  let character
  if (text.characterId && characters[text.characterId]) {
    character = characters[text.characterId]
  }
  return getTextComponent(text, character)
}

const styles = {
  normal: StyleSheet.create({
    row: {
      margin: 20,
      marginBottom: 0,
      borderRadius: 6,
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
    character: {
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
    rowWrapper: {
      flex: 1,
      flexDirection: 'row',
    },
    row: {
      maxWidth: 500,
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
    character: {
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
      flex: 1,
      alignSelf: 'flex-end',
      maxWidth: 300 + 15,
      marginRight: 15,
      marginTop: 20,
      borderRadius: 17,
      backgroundColor: '#9de05b',
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    text: {
      fontSize: 16,
      lineHeight: 16 + 6,
    },
    character: {
      color: '#5a5a5a',
      fontSize: 11,
      marginBottom: 6,
    },
    chatBubbleTail: {
      position: 'absolute',
      top: 0,
      right: -4,
    },
  }),
}

export default ScriptText
