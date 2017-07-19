// @flow
import React from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native'

import colors from './colors'

const ListItem = ({ item }) => {
  const onPress = () => {
    Linking.openURL(item.episode_uri)
  }
  return (
    <TouchableOpacity
      focusedOpacity={1}
      activeOpacity={1}
      onPress={ onPress }
    >
      <View style={ styles.container }>
        <Image style={ styles.image } source={{ uri: item.thumbnail_url }} />
        <View style={ styles.textWrapper }>
          <Text style={ styles.title }>{ item.title }</Text>
          <Text style={ styles.description } numberOfLines={ 2 } ellipsizeMode={ 'tail' }>{ item.description }</Text>
        </View>
      </View>
    </TouchableOpacity>
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
    height: 100,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    color: colors.title,
    fontSize: 15,
    lineHeight: 18,
    paddingLeft: 20,
    marginBottom: 10,
  },
  description: {
    color: colors.description,
    fontSize: 11,
    lineHeight: 16,
    paddingLeft: 20,
  }
})

export default ListItem
