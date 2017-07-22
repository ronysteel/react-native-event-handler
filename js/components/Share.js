// @flow
import React from 'react'
import { Text, View, Dimensions, StyleSheet } from 'react-native'

import TwitterIcon from './icons/TwitterIcon'
import FacebookIcon from './icons/FacebookIcon'
import LineIcon from './icons/LineIcon'
import LinkIcon from './icons/LinkIcon'

const { height } = Dimensions.get('window')

const Share = ({ readState }) => {
  if (!readState.reachEndOfContent) {
    return null
  }
  return (
    <View style={ styles.container }>
      <View style={ styles.backDrop }/>
      <View>
        <Text style={ styles.text }>
          { "怖かった…？ \n怖かったらこのノベルをシェアしよう…" }
        </Text>
        <View style={ styles.iconsWrapper }>
          <TwitterIcon style={ styles.icon } />
          <FacebookIcon style={ styles.icon } />
          <LineIcon style={ styles.icon } />
          <LinkIcon />
        </View>
        <View style={ styles.recommends }>
        </View>
      </View>
    </View>
  )
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  backDrop: {
    backgroundColor: '#212121',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 355 + height,
  },
  text: {
    color: '#fff',
    marginTop: 128,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 25,
  },
  iconsWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 30,
  },
  icon: {
    marginRight: 15,
  },
  recommends: {
    marginTop: 129,
  }
})

export default Share
