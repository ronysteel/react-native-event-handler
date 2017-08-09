// @flow
import React from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
  StyleSheet,
} from 'react-native'

import colors from './colors'

const PickupItem = (onPress, { item, index }) => {
  return (
    <TouchableOpacity
      focusedOpacity={1}
      activeOpacity={1}
      onPress={ onPress.bind(null, index, item) }
    >
      <View style={ styles.container }>
        <Image style={ styles.image } source={{ uri: item.thumbnailUrl }} />
        <Text style={ styles.title }>{ item.title }</Text>
        <Text style={ styles.description }>{ item.description }</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 19,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    height: Dimensions.get('window').width * (9 / 16),
    marginBottom: 18,
  },
  title: {
    color: colors.title,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 23,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 4,
  },
  description: {
    color: colors.description,
    fontSize: 13,
    lineHeight: 18,
    paddingLeft: 15,
    paddingRight: 15,
  }
})

export default PickupItem
