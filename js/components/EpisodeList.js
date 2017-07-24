// @flow
import React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'

import Header from './EpisodeListHeader'

const renderItem = (novel, { item }) => (
  <View style={ styles.container }>
    <View style={ styles.wrapper }>
      <Text style={ styles.novelTitle }>{ novel.title }</Text>
      <Text style={ styles.episodeTitle }>{ item.title }</Text>
    </View>
  </View>
)

const EpisodeList = ({ novel, episodes, closeModal }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#212121' }}>
      <Header closeModal={ closeModal } />
      <FlatList
        data={ episodes }
        renderItem={ renderItem.bind(null, novel) }
        keyExtractor={ item => `${item.id}` }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 90,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
    borderBottomWidth: 0.5,
    borderColor: '#3a3a3a',
  },
  novelTitle: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 10,
  },
  episodeTitle: {
    fontSize: 15,
    color: '#fff',
  }
})

export default EpisodeList
