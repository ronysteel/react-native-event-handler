// @flow
import React from 'react'
import { StyleSheet, Image, Text, View } from 'react-native'

import colors from './colors'

const PickupItem = ({ item }) => {
  return (
    <View style={ styles.container }>
      <Image style={ styles.image } source={{ uri: item.thumbnail_url }} />
      <Text style={ styles.title }>{ item.title }</Text>
      <Text style={ styles.description }>{ item.description }</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    height: 200,
    marginBottom: 20,
  },
  title: {
    color: colors.title,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
  },
  description: {
    color: colors.description,
    fontSize: 12,
    lineHeight: 17,
    paddingLeft: 15,
    paddingRight: 15,
  }
})

export default PickupItem
