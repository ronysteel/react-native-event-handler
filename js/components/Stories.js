// @flow
import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  SectionList,
  StyleSheet,
} from 'react-native'
import { List } from 'react-native-elements'

import type { Stories as StoriesStore } from '../reducers/stories'
import PickupItem from './PickupItem'
import ListItem from './ListItem'
import GridItem from './GridItem'
import colors from './colors'

type Props = {
  stories: StoriesStore;
}

const renderGridWrapper = ({ item }) => {
  return (
    <FlatList
      data={ item.items }
      renderItem={ GridItem }
      numColumns={ 2 }
      keyExtractor={item => `${item.id}`}
    />
  )
}

const Stories = ({ sections }: Props) => {
  const s = sections.map((v, i) => {
    v.data = v.novels
    if (v.type == 'pickup') {
      v.renderItem = PickupItem
    } else if (v.type == 'list') {
      v.renderItem = ListItem
    } else if (v.type == 'grid') {
      v.renderItem = renderGridWrapper
      v.data = [{ items: v.novels, key: 1 }]
    }
    return v
  })

  return (
    <List style={styles.container}>
      <SectionList
        renderSectionHeader={({ section })=> {
          if (!section.title) return null
          return (
            <View>
              <View style={ styles.sectionSeparator } />
              <Text style={ styles.sectionTitle }>{ section.title }</Text>
            </View>
          )
        }}
        renderItem={ () => null }
        stickySectionHeadersEnabled={ false }
        sections={ s }
        keyExtractor={item => `${item.id}`}
      />
    </List>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
  },
  sectionTitle: {
    paddingLeft: 15,
    color: colors.sectionTitle,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 29,
  },
  sectionSeparator: {
    borderTopWidth: 0.5,
    borderColor: '#3a3a3a',
    marginBottom: 28,
  },
  item: {
    padding: 10,
    fontSize: 18,
  },
})

export default Stories
