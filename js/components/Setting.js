// @flow
import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native'

import ListHeader from './ListHeader'
import RightArrowIcon from './RightArrowIcon'

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
      <View style={ styles.arrow }>
        <RightArrowIcon />
      </View>
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
    backgroundColor: '#f3f3f3',
  },
  listWrapper: {
    borderTopWidth: 0.5,
    borderColor: '#999999',
  },
  separator: {
    marginLeft: 15,
    borderBottomWidth: 0.5,
    borderColor: '#d6d6d6',
  },
  listContainer: {
    flex: 1,
    height: 54,
    paddingLeft: 15,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 14,
    color: '#000',
  },
  arrow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 22,
    justifyContent: 'center',
  },
})

export default Setting
