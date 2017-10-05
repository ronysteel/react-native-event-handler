// @flow
import React from 'react'
import { Animated, View } from 'react-native'

type Props = {
  isVisible: boolean,
  dismissed: Function,
  style: any,
  children: any
}

type State = {
  fadeAnim: Object
}

export default class FadeinView extends React.Component<void, Props, State> {
  state = {
    fadeAnim: new Animated.Value(0)
  }

  componentDidMount () {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: 1000
    }).start()
  }

  componentWillUpdate (nextProps: Props) {
    if (
      this.props.isVisible !== nextProps.isVisible &&
      nextProps.isVisible === false
    ) {
      this.fadeout()
    }
  }

  fadeout () {
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      duration: 300
    }).start(this.props.dismissed())
  }

  render () {
    let { fadeAnim } = this.state
    const { style } = this.props

    return (
      <Animated.View style={[{ opacity: fadeAnim }].concat(style || [])}>
        {this.props.isVisible && this.props.children}
      </Animated.View>
    )
  }
}
