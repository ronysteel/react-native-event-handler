// @flow
import React from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
  StyleSheet,
} from 'react-native'

import colors from './colors'

const windowWidth = Dimensions.get('window').width;

const GridItem = ({ item, index }) => {
  const onPress = () => {
    Linking.openURL(item.episode_uri)
  }
  return (

    <TouchableOpacity
      focusedOpacity={1}
      activeOpacity={1}
      onPress={ onPress }
    >
      <View style={{
        width: (windowWidth / 2),
        paddingLeft: index % 2 ? (15 / 2) : 15,
        paddingRight: index % 2 ? 15 : (15 / 2),
        marginBottom: 30,
      }}>
        <Image style={ styles.image } source={{ uri: item.thumbnail_url }} />
        <View>
          <Text style={ styles.title }>{ item.title }</Text>
          <Text style={ styles.description } numberOfLines={ 2 } ellipsizeMode={ 'tail' }>{ item.description }</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const imageWidth = (windowWidth - (15 * 3)) / 2

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height: imageWidth * (3 / 4),
    marginBottom: 10,
  },
  title: {
    color: colors.title,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
    marginBottom: 10,
  },
  description: {
    color: colors.description,
    fontSize: 11,
    lineHeight: 16,
  }
})

export default GridItem
