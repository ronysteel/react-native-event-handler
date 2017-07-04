// @flow
import React, { Component } from 'react'
import { ScrollView, FlatList, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
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
    return (
      <View style={ styles.row }>
        <Text style={ styles.text }>{ item.text.body }</Text>
      </View>
    )
  }

  // const scrollView = props => {
  //   return (
  //     <ScrollView {...props}>
  //       <TouchableWithoutFeedback onPress={ onTapScreen } {...props}  style={ styles.container } />
  //     </ScrollView>
  //   )
  // }

  return (
    <TouchableWithoutFeedback onPress={ onTapScreen } style={ styles.container }>
      <View style={ styles.container }>
        <FlatList
          data={ scripts }
          renderItem={ renderItem }
          keyExtractor={item => `${item.id}`}
          // renderScrollComponent={ scrollView }
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
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
    fontSize: 18,
  }
})

export default EpisodeDetail
