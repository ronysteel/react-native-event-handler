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
        paddingLeft: index % 2 ? 5 : 15,
        paddingRight: index % 2 ? 15 : 5,
        marginBottom: 30,
      }}>
        <Image style={ styles.image } source={{ uri: item.thumbnail_url }} />
        <View>
          <Text style={ styles.title }>{ item.title }</Text>
          <Text style={ styles.description }>{ item.description }</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height: 130,
    marginBottom: 5,
  },
  title: {
    color: colors.title,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
    marginBottom: 10,
  },
  description: {
    color: colors.description,
    fontSize: 12,
    lineHeight: 17,
  }
})

export default GridItem
