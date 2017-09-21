// @flow
import React from 'react'
import {
  View,
  Text,
  SectionList,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet
} from 'react-native'

import ListHeader from './ListHeader'
import RightArrowIcon from './RightArrowIcon'

const onPress = item => {
  Linking.openURL(item.url)
}

const Separator = () => <View style={styles.separator} />

const Footer = () => <View style={styles.footer} />

const renderRight = item => {
  if (item.url) {
    return <RightArrowIcon />
  }

  if (item.ticketCount !== undefined) {
    return <Text>{`${item.ticketCount}枚`}</Text>
  }

  return null
}

const renderItem = ({ item }) => {
  const inner = (
    <View style={styles.listContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.arrow}>{renderRight(item)}</View>
    </View>
  )

  if (item.url) {
    return (
      <TouchableOpacity onPress={onPress.bind(null, item)}>
        {inner}
      </TouchableOpacity>
    )
  }

  return inner
}

const sectionHeader = () => (
  <View
    style={{
      backgroundColor: '#f3f3f3',
      height: 20
    }}
  />
)

const Setting = ({ links, firstRow, onTapClose }) => (
  <View style={styles.root}>
    <ListHeader title={'設定・その他'} closeModal={onTapClose} />
    <SectionList
      sections={[
        {
          data: [firstRow],
          ItemSeparatorComponent: Separator
        },
        {
          data: links,
          ItemSeparatorComponent: Separator
        }
      ]}
      renderSectionHeader={sectionHeader}
      renderItem={renderItem}
      stickySectionHeadersEnabled={false}
      keyExtractor={item => `${item.key}`}
    />
  </View>
)

const styles: StyleSheet = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f3f3'
  },
  listWrapper: {
    borderTopWidth: 0.5,
    borderColor: '#999999'
  },
  separator: {
    marginLeft: 15,
    borderBottomWidth: 0.5,
    borderColor: '#d6d6d6'
  },
  listContainer: {
    flex: 1,
    height: 54,
    paddingLeft: 15,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 14,
    color: '#000'
  },
  arrow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 22,
    justifyContent: 'center'
  }
})

export default Setting
