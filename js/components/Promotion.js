// @flow
import React from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

const Promotion = ({ readState }) => {
  if (!readState.displayPromotion) {
    return null
  }
  return (
    <View><Text>{ "Promotion" }</Text></View>
  )
}

export default Promotion
