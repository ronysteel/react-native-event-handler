// @flow
import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

const renderNormal = (description) => (
  <View style={ styles.normal.container }>
    <View style={ styles.normal.row }>
      <Text style={ styles.normal.text }>{ description.body }</Text>
    </View>
  </View>
)

const renderChat = (description) => (
  <View style={ styles.chat.container }>
    <View style={ styles.chat.row }>
      <Text style={ styles.chat.text }>{ description.body }</Text>
    </View>
  </View>
)

const getComponent = (description) => {
  switch (description.type) {
    case 'NORMAL': {
      return renderNormal(description)
    }
    case 'CHAT': {
      return renderChat(description)
    }
    default: {
      return null
    }
  }
}

const ScriptDescription = ({ description, isLatestItem }) => {
  return getComponent(description)
}

const styles = {
  normal: StyleSheet.create({
    container: {
      flex: 1,
    },
    row: {
      margin: 20,
      marginBottom: 0,
      borderRadius: 2,
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderWidth: 0.5,
      borderColor: '#d8d8d8',
    },
    text: {
      textAlign: 'center',
      fontSize: 14,
      color: '#5a5a5a',
      lineHeight: 14 + 6,
    }
  }),
  chat: StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignSelf: 'center',
    },
    row: {
      margin: 20,
      marginBottom: 0,
      borderRadius: 17,
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    text: {
      textAlign: 'center',
      fontSize: 14,
      color: '#5a5a5a',
      lineHeight: 14 + 6,
    }
  })
}

export default ScriptDescription
