// @flow
import React from 'react'
import { Text, View, Dimensions, StyleSheet } from 'react-native'

import TwitterIcon from './icons/TwitterIcon'
import FacebookIcon from './icons/FacebookIcon'
import LineIcon from './icons/LineIcon'
import LinkIcon from './icons/LinkIcon'
import Recommends from './Recommends'

const { height } = Dimensions.get('window')

const Share = ({
  novel,
  shareText,
  readState,
  shareOptions,
  recommends,
  onSelectContent,
  onPressShare,
}) => {
  if (!readState.reachEndOfContent) {
    return null
  }

  if (!shareOptions) {
    return null
  }

  return (
    <View style={ styles.container }>
      <View style={ styles.backDrop }/>
      <View style={ styles.shareContainer }>
        <Text style={ styles.text }>
          { shareText }
        </Text>
        <View style={ styles.iconsWrapper }>
          <TwitterIcon
            onPress={ onPressShare.bind(null, 'twitter') }
            options={ shareOptions }
            style={ styles.icon }
          />
          <FacebookIcon
            onPress={ onPressShare.bind(null, 'facebook') }
            options={ shareOptions }
            style={ styles.icon }
          />
          <LineIcon
            onPress={ onPressShare.bind(null, 'line') }
            options={ shareOptions }
            style={ styles.icon }
          />
          <LinkIcon
            onPress={ onPressShare.bind(null, 'link') }
            options={ shareOptions }
          />
        </View>
        <View style={ styles.separator } />
        <View>
          <Recommends
            novel={ novel }
            recommends={ recommends }
            onSelectContent={ onSelectContent }
          />
        </View>
      </View>
    </View>
  )
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backDrop: {
    backgroundColor: '#f3f3f3',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 355 + height,
  },
  text: {
    color: '#000',
    marginTop: 120,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 25,
  },
  iconsWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 120,
  },
  icon: {
    marginRight: 15,
  },
  separator: {
    height: 14,
    backgroundColor: '#f3f3f3',
  },
  shareContainer: {
    backgroundColor: '#fff',
  },
})

export default Share
