import React from 'react'
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

import TapIcon from './TapIcon'

const tapAreaHeight = 250

const TapArea = () => {
  let text = 'タップして読みはじめましょう'
  // if (readState.reachEndOfContent) {
  //   text = 'ノベルの世界をもっと楽しみましょう'
  // }
  return (
    <View
      focusedOpacity={ 1 }
      activeOpacity={ 1 }
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#aaa',
      }}
    >
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 130,
        alignItems: 'center',
      }}>
        <TapIcon />
        <Text style={{
          color: '#00000050',
          fontSize: 16,
          fontWeight: '600',
          marginTop: 20,
        }}>{ text }</Text>
      </View>
    </View>
  )
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBackground: {
    backgroundColor: '#212121',
  },
})

export default TapArea
