// @flow
import React, { Component } from 'react'
import {
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import { List, ListItem } from 'react-native-elements'

import type { Episode } from '../reducers/episodes'
import type { Scripts } from '../reducers/scripts'

type Props = {
  episode: Episode;
  scripts: Scripts;
  onTapScreen: Function;
}

class CustomScrollView extends React.Component {
  render() {
    return (
      <ScrollView style={ styles.container }>
        <TouchableOpacity
          focusedOpacity={1}
          activeOpacity={1}
          onPress={ this.props.onTapScreen }
          style={{
            backgroundColor: 'transparent',
          }}>
          <View {...this.props} style={ styles.container } />
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const renderCharactorName = text => {
  if (text.charactor) {
    return <Text style={ styles.charactor }>{ text.charactor.name }</Text>
  }
  return null
}

const renderItem = ({ item }) => {
  if (item.dummy) {
    return <View style={{ height: 500 }} />
  }

  if (item.type === 'TEXT') {
    return (
      <View style={ styles.row }>
        { renderCharactorName(item.text) }
        <Text style={ styles.text }>{ item.text.body }</Text>
      </View>
    )
  }

  return null
}

const EpisodeDetail = ({ episode, scripts, onTapScreen }: Props) => {
  const scrollView = props => {
    return (
      <CustomScrollView {...props} onTapScreen={ onTapScreen } />
    )
  }

  const items: any = [
    ...Object.values(scripts),
    { dummy: true }
  ]

  return (
    <View style={ styles.container }>
      <FlatList
        data={ items }
        renderItem={ renderItem }
        keyExtractor={item => `${item.id}`}
        renderScrollComponent={ scrollView }
      />
    </View>
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
    fontSize: 16,
  },
  charactor: {
    fontSize: 12,
    marginBottom: 5,
  }
})

export default EpisodeDetail
