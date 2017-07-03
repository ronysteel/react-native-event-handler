// @flow
import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { List, ListItem } from 'react-native-elements'

import type { Stories as StoriesStore } from '../reducers/stories'

type Props = {
  stories: StoriesStore;
  onPressStory: Function;
}

const Stories = ({ stories, onPressStory }: Props) => {
  const renderItem = ({item}) => {
    return (
      <ListItem
        title={ item.title }
        onPress={ onPressStory.bind(null, item) }
      />
    )
  }

  return (
    <List style={styles.container}>
      <FlatList
        data={Object.values(stories)}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
      />
    </List>
  )
}

const styles = StyleSheet.create({
  container: {},
  wrapper: {},
  item: {
    padding: 10,
    fontSize: 18,
  },
})

export default Stories
