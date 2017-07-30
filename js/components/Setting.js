// @flow
import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native'

import ListHeader from './ListHeader'

const onPress = item => {
  Linking.openURL(item.url)
}

const Separator = () => (
  <View style={ styles.separator }></View>
)

const Footer = () => (
  <View style={ styles.footer }></View>
)

const renderItem = ({ item }) => (
  <TouchableOpacity onPress={ onPress.bind(null, item) }>
    <View style={ styles.listContainer }>
      <Text style={ styles.title }>{ item.title }</Text>
    </View>
  </TouchableOpacity>
)

const Setting = ({ links, onTapClose }) => (
  <View style={ styles.root }>
    <ListHeader
      title={ '設定・その他' }
      closeModal={ onTapClose }
    />
    <FlatList
      data={ links }
      renderItem={ renderItem }
      keyExtractor={ item => `${item.key}` }
      ItemSeparatorComponent={ Separator }
      ListFooterComponent={ Footer }
      style={ styles.listWrapper }
    />
  </View>
)

const styles: StyleSheet = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#212121',
  },
  listWrapper: {
    borderTopWidth: 0.5,
    borderColor: '#3a3a3a',
  },
  separator: {
    marginLeft: 15,
    borderBottomWidth: 0.5,
    borderColor: '#3a3a3a',
  },
  listContainer: {
    flex: 1,
    height: 54,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    color: '#fff',
  },
  footer: {
    borderTopWidth: 0.5,
    borderColor: '#3a3a3a',
  },
})

export default Setting