// @flow
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0
const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 56

const CloseIcon = () => (
  <Svg width="15" height="15" viewBox="0 0 15 15">
    <Path
      d="M1.416 1.96l-.133.13 5.57 5.57-5.638 5.636.132.133L6.984 7.79l5.966 5.966.133-.132L7.117 7.66l5.898-5.898-.133-.133-5.898 5.897L1.416 1.96z"
      stroke="#FFF"
      strokeWidth="1.5"
      fill="none"
    />
  </Svg>
)

const EpisodeListHeader = ({ closeModal }) => {
  return (
    <View style={ styles.container }>
      <View style={ styles.header}>
        <View style={ styles.left }>
          <TouchableOpacity onPress={ closeModal }>
            <View style={ styles.close }>
              <CloseIcon />
            </View>
          </TouchableOpacity>
        </View>
        <View style={ styles.title }>
          <Text style={ styles.titleText }>{ 'エピソード一覧' }</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    height: APPBAR_HEIGHT + STATUSBAR_HEIGHT,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flex: 1,
  },
  left: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  title: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 64,
    right: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  close: {
    padding: 15,
  },
})

export default EpisodeListHeader
