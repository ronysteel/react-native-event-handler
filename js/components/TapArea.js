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

class TapArea extends React.PureComponent {
  state = {
    v: new Animated.Value(0),
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.readState.reachEndOfContent &&
      !prevProps.readState.reachEndOfContent
    ) {
      this.state.v.setValue(0)
      Animated.timing(this.state.v, {
        toValue: 1,
        duration: 700,
      }).start();
    }
  }

  render() {
    const { offset, readState } = this.props
    let text = 'タップして読みはじめましょう'
    let style = {
      opacity: offset.interpolate({
        inputRange: [2, 100],
        outputRange: [1, 0],
      })
    }

    if (readState.reachEndOfContent) {
      text = 'ノベルの世界をもっと楽しみましょう'
      style = { opacity: this.state.v }
    }

    let textColor = { color: 'rgba(0, 0, 0, 0.5)' }
    const theme = 'dark'
    if (theme == 'dark') {
      textColor = { color: 'rgba(255, 255, 255, 0.5)' }
    }


    return (
      <Animated.View
        focusedOpacity={ 1 }
        activeOpacity={ 1 }
        style={[ styles.container, style ]}
      >
        <View style={ styles.tapAreaWrapper }>
          <TapIcon theme={ theme } />
          <Text style={[styles.text, textColor ]}>{ text }</Text>
        </View>
      </Animated.View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 1,
  },
  tapAreaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
    alignItems: 'center',
  },
  text: {
    color: '#00000050',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    backgroundColor: 'transparent',
  }
})

export default TapArea
