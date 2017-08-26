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

import type { Stories as StoriesStore } from '../reducers/stories'
import PickupItem from './PickupItem'
import ListItem from './ListItem'
import GridItem from './GridItem'
import colors from './colors'

type Props = {
  stories: StoriesStore;
}

const renderGridWrapper = (onPress, { item }) => {
  return (
    <FlatList
      data={ item.items }
      renderItem={ GridItem.bind(null, onPress) }
      numColumns={ 2 }
      keyExtractor={item => `${item.id}`}
      style={{ backgroundColor: '#fff' }}
    />
  )
}

const Stories = ({ sections, onSelectContent }: Props) => {
  const s = sections.map((v, i) => {
    v.data = v.novels
    if (v.type == 'pickup') {
      v.renderItem = PickupItem.bind(null, onSelectContent.bind(null, `${v.id}`))
    } else if (v.type == 'list') {
      v.renderItem = ListItem.bind(null, onSelectContent.bind(null, `${v.id}`))
    } else if (v.type == 'grid') {
      v.renderItem = renderGridWrapper.bind(null, onSelectContent.bind(null, `${v.id}`))
      v.data = [{ items: v.novels, key: 1 }]
    }
    return v
  })

  return (
    <View style={ styles.container }>
      <SectionList
        renderSectionHeader={({ section })=> {
          if (!section.title) return null
          return (
            <View style={ styles.sectionHeader }>
              <View style={ styles.sectionSeparator } />
              <Text style={ styles.sectionTitle }>{ section.title }</Text>
            </View>
          )
        }}
        renderItem={ () => null }
        stickySectionHeadersEnabled={ false }
        sections={ s }
        style={ styles.sectionContainer }
        keyExtractor={item => `${item.id}`}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f3f3',
  },
  sectionContainer: {
    backgroundColor: '#f3f3f3',
  },
  sectionHeader: {
    backgroundColor: '#fff',
  },
  sectionTitle: {
    paddingLeft: 15,
    color: colors.sectionTitle,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  sectionSeparator: {
    backgroundColor: '#f3f3f3',
    height: 8,
    marginBottom: 25,
  },
  item: {
    padding: 10,
    fontSize: 18,
  },
})

export default Stories
