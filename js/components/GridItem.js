// @flow
import React from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
  StyleSheet
} from 'react-native'

import colors from './colors'

const windowWidth = Dimensions.get('window').width

const Tag = ({ index, item }) => {
  if (!item.tags) {
    return null
  }

  if (item.tags && item.tags.length == 0) {
    return null
  }

  return (
    <View
      style={[
        styles.tagWrapper,
        {
          left: index % 2 ? 15 / 2 : 15
        }
      ]}
    >
      <View style={styles.tag}>
        <Text style={styles.tagText}>{item.tags[0]}</Text>
      </View>
    </View>
  )
}

const GridItem = (onPress, { item, index }) => {
  return (
    <TouchableOpacity
      focusedOpacity={1}
      activeOpacity={1}
      onPress={onPress.bind(null, index, item)}
    >
      <View
        style={{
          position: 'relative',
          width: windowWidth / 2,
          paddingLeft: index % 2 ? 15 / 2 : 15,
          paddingRight: index % 2 ? 15 : 15 / 2,
          marginBottom: 18
        }}
      >
        <Image style={styles.image} source={{ uri: item.thumbnailUrl }} />
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode={'tail'}
          >
            {item.description}
          </Text>
        </View>
      </View>
      <Tag index={index} item={item} />
    </TouchableOpacity>
  )
}

const imageWidth = (windowWidth - 15 * 3) / 2

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height: imageWidth * (3 / 4),
    borderRadius: 4,
    marginBottom: 15
  },
  title: {
    color: colors.title,
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 16,
    marginBottom: 2,
    marginLeft: 2
  },
  description: {
    color: colors.description,
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 2
  },
  tagWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    top: imageWidth * (3 / 4) - (17 - 9),
    left: 0
  },
  tag: {
    flexWrap: 'wrap',
    minWidth: 36,
    backgroundColor: '#373737',
    paddingVertical: 3,
    paddingHorizontal: 3
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    lineHeight: 10,
    textAlign: 'center'
  }
})

export default GridItem
