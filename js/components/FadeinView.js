// @flow
import React from 'react'
import { Animated, View } from 'react-native'

export default class FadeinView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0)
  }

  componentDidMount () {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: 1000,
    }).start()
  }

  render () {
    let { fadeAnim } = this.state
    const { style } = this.props;

    return (
      <Animated.View
        style={[
          { opacity: fadeAnim }
        ].concat(style || [])}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}
