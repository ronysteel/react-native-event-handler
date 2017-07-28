// @flow
import React from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

const Promotion = ({ paid, readState, onTapPurchase }) => {
  if (paid) {
    return null
  }
  if (!readState.displayPromotion) {
    return null
  }
  return (
    <View style={ styles.container }>
      <TouchableOpacity onPress={ onTapPurchase }>
        <Text>{ "Promotion" }</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
})

export default Promotion
