// @flow
import React from 'react'
import { Animated } from 'react-native'

export default class FadeinView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0)
  }

  componentDidMount () {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 500
    }).start()
  }

  render () {
    const { fadeAnim } = this.state

    return (
      <Animated.View
        style={{
          ...this.props.style,
          opacity: fadeAnim
        }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}
