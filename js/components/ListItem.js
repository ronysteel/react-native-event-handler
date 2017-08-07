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

const ListItem = (onPress, { item, index }) => {
  return (
    <TouchableOpacity
      focusedOpacity={1}
      activeOpacity={1}
      onPress={ onPress.bind(null, index, item) }
    >
      <View style={ styles.container }>
        <Image style={ styles.image } source={{ uri: item.thumbnailUrl }} />
        <View style={ styles.textWrapper }>
          <Text style={ styles.title }>{ item.title }</Text>
          <View style={ styles.tagWrapper }>
            <View style={ styles.tag }>
              <Text style={ styles.tagText }>{ item.tags[0] }</Text>
            </View>
          </View>
          <Text
            numberOfLines={ 2 }
            ellipsizeMode={ 'tail' }
            style={ styles.description }
          >{ item.description }</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 25,
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
    fontWeight: '500',
    lineHeight: 20,
    marginLeft: 20,
    marginBottom: 7,
  },
  description: {
    color: colors.description,
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 20,
    marginTop: 6,
  },
  tagWrapper: {
    flexDirection:'row',
    marginLeft: 20,
  },
  tag: {
    flexWrap: 'wrap',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#565656',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  tagText: {
    color: '#6e6e6e',
    fontSize: 10,
    lineHeight: 10,
  }
})

export default ListItem
