// @flow
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import FadeinView from '../FadeinView'

const renderCharactorName = text => {
  if (text.charactor) {
    return <Text style={ styles.charactor }>{ text.charactor.name }</Text>
  }
  return null
}

const ScriptText = ({ item, isLatestItem }) => {
  const textComponent = (
    <View style={ styles.row }>
      { renderCharactorName(item.text) }
      <Text style={ styles.text }>{ item.text.body }</Text>
    </View>
  )
  if (isLatestItem) {
    return (
      <FadeinView>
        <View>
          { textComponent }
        </View>
      </FadeinView>
    )
  }
  return textComponent
}

const styles: StyleSheet = StyleSheet.create({
  row: {
    margin: 10,
    marginBottom: 0,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 2,
    backgroundColor: '#fff',
    padding: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 16 + 4,
  },
  charactor: {
    fontSize: 12,
    marginBottom: 5,
  }
})

export default ScriptText
