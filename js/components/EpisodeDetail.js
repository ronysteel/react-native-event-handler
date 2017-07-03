// @flow
import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import { List, ListItem } from 'react-native-elements'

import type { Episode } from '../reducers/episodes'
import type { Scripts } from '../reducers/scripts'

type Props = {
  episode: Episode;
  scripts: Scripts;
  onTapScreen: Function;
}

const EpisodeDetail = ({ episode, scripts, onTapScreen }: Props) => {
  const renderItem = ({ item }) => {
    return <ListItem title={ item.text.body } />
  }

  return (
    <TouchableHighlight onPress={ onTapScreen } style={ styles.container }>
      <View style={ styles.container }>
        <List style={ styles.container }>
          <FlatList
            data={ scripts }
            renderItem={ renderItem }
            keyExtractor={item => `${item.id}`}
          />
        </List>
      </View>
    </TouchableHighlight>
  )
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default EpisodeDetail
