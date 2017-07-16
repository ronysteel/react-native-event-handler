// @flow
import React from 'react'
import { StyleSheet, Image, Text, View } from 'react-native'

import colors from './colors'

const ListItem = ({ item }) => {
  return (
    <View style={ styles.container }>
      <Image style={ styles.image } source={{ uri: item.thumbnail_url }} />
      <View style={ styles.textWrapper }>
        <Text style={ styles.title }>{ item.title }</Text>
        <Text style={ styles.description }>{ item.description }</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 30,
  },
  image: {
    resizeMode: 'cover',
    width: 100,
    height: 130,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    color: colors.title,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
    paddingLeft: 15,
    marginBottom: 10,
  },
  description: {
    color: colors.description,
    fontSize: 12,
    lineHeight: 17,
    paddingLeft: 15,
  }
})

export default ListItem
