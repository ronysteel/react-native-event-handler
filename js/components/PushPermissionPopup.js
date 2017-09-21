// @flow
import React from 'react'
import FadeinView from './FadeinView'
import {
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  View,
  Modal,
  TouchableOpacity
} from 'react-native'
import { BlurView, VibrancyView } from 'react-native-blur'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const PushPermissionPopup = ({ onPress }) => {
  return (
    <Modal transparent>
      <FadeinView style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.popupInner}>
            <VibrancyView
              blurType='xlight'
              blurAmount={10}
              style={styles.blur}
            />
            <Image
              source={require('./img/permission.png')}
              style={styles.image}
            />
            <Text style={styles.text}>
              {'通知をオンにすると、編集部おすすめノベルやチケットプレゼントなどのお得な情報をお届けします！'}
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={onPress}>
              <Text style={styles.startButtonText}>{'はじめる'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </FadeinView>
    </Modal>
  )
}

const BASE_WIDTH = 375
const BASE_HEIGHT = 667
const styles: StyleSheet = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center'
  },
  wrapper: {
    flex: 1,
    margin: SCREEN_WIDTH * (40 / BASE_WIDTH),
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 12
  },
  blur: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 12
  },
  popupInner: {
    width: SCREEN_WIDTH * (295 / BASE_WIDTH),
    padding: SCREEN_WIDTH * (30 / BASE_WIDTH),
    alignSelf: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.0)'
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21
  },
  image: {
    width: SCREEN_WIDTH * (235 / BASE_WIDTH),
    height: SCREEN_HEIGHT * (168 / BASE_HEIGHT)
  },

  startButton: {
    height: 50,
    borderRadius: 6,
    backgroundColor: '#ff395d',
    marginTop: SCREEN_WIDTH * (25 / BASE_WIDTH),
    justifyContent: 'center'
  },
  startButtonText: {
    color: '#fff',
    backgroundColor: 'transparent',
    fontSize: 16,
    textAlign: 'center'
  }
})

export default PushPermissionPopup
