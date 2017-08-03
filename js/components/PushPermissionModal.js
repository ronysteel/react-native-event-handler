// @flow
import React from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native'
import { BlurView, VibrancyView } from 'react-native-blur'

const SCREEN_WIDTH = Dimensions.get('window').width

const PushPermissionModal = () => {
  return (
    <Modal transparent>
      <View style={ styles.container }>
        <VibrancyView blurType="xlight" blurAmount={ 10 } style={ styles.popup }>
        </VibrancyView>
      </View>
      <View style={ styles.popupInnerContainer }>
        <View style={ styles.popupInner }>
          <View style={ styles.alert }>
            <Text style={ styles.alertText }>
              { `“CHAT NOVEL”は\n通知を送信します\n通知をオンにしましょう！` }
            </Text>
            <View style={ styles.alertButtonWrapper }>
              <View style={ styles.alertLook } />
              <Text style={ styles.alertNgText }>
                { `許可しない` }
              </Text>
              <View style={ styles.alertOkTextWrapper }>
                <Text style={ styles.alertOkText }>
                  { `許可` }
                </Text>
              </View>
            </View>
          </View>
          <Text style={ styles.text }>
            { '通知をオンにすると、編集部おすすめノベルやチケットプレゼントなどのお得な情報をお届けします！' }
          </Text>
          <View style={ styles.startButton }>
            <Text style={ styles.startButtonText }>
              { 'はじめる' }
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
  },
  popup: {
    alignSelf: 'center',
    borderRadius: 12,
    width: SCREEN_WIDTH - (40*2),
    height: 372,
  },
  popupInnerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  popupInner: {
    alignSelf: 'center',
    borderRadius: 12,
    width: SCREEN_WIDTH - (40*2),
    height: 372,

    backgroundColor: 'rgba(255,255,255,0.0)',
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  text: {
    marginTop: 20,
    fontSize: 14,
    lineHeight: 21,
  },

  // alert
  alert: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#9c9c9c',
    borderRadius: 8,
  },
  alertText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 17,
  },
  alertButtonWrapper: {
    position: 'relative',
    borderTopWidth: 0.5,
    borderColor: '#dbdbdb',
    height: 42,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  alertNgText: {
    flex: 0.5,
    color: '#007aff',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 15,
  },
  alertOkText: {
    color: '#007aff',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 15,
  },
  alertOkTextWrapper: {
    flex: 0.5,
    borderLeftWidth: 0.5,
    borderColor: '#dbdbdb',
  },
  alertLook: {
    position: 'absolute',
    right: 25,
    bottom: -11,
    width: 66,
    height: 66,
    borderWidth: 1,
    borderRadius: 66,
    borderColor: '#007aff',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },

  startButton: {
    height: 50,
    borderRadius: 6,
    backgroundColor: '#ff395d',
    marginTop: 25,
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    backgroundColor: 'transparent',
    fontSize: 16,
    textAlign: 'center',
  },
})

export default PushPermissionModal
