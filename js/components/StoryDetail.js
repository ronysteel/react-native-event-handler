// @flow
import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { List, ListItem } from 'react-native-elements'

import type { Story } from '../reducers/stories'
import type { Episodes } from '../reducers/episodes'

type Props = {
  story: Story;
  episodes: Episodes;
  onPressEpisode: Function;
}

const StoryDetail = ({ story, episodes, onPressEpisode }: Props) => {
  const renderItem = ({ item }) => (
    <ListItem
      title={ item.title }
      onPress={ onPressEpisode.bind(null, item)}
    />
  )

  return (
    <View style={ styles.container }>
      <Text>{ story.title }</Text>

      <List style={ styles.container }>
        <FlatList
          data={ episodes }
          renderItem={ renderItem }
          keyExtractor={item => `${item.id}`}
        />
      </List>
    </View>
  )
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default StoryDetail
