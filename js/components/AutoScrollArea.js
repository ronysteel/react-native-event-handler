import React from 'react'
import { Animated } from 'react-native'
import AutoScrollIcon from './AutoScrollIcon'

class AutoScrollArea extends React.PureComponent {
  state = {
    visible: false,
    v: new Animated.Value(0)
  }

  styles = {
    wrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 100,
      alignItems: 'center',
      opacity: this.state.v
    },
    icon: {
      position: 'absolute',
      bottom: 31
    }
  }

  componentDidUpdate () {
    if (!this.state.visible && this.props.autoScrolling) {
      this.state.visible = true
      Animated.timing(this.state.v, { toValue: 1, duration: 500 }).start()
    } else if (this.state.visible && !this.props.autoScrolling) {
      this.state.visible = false
      Animated.timing(this.state.v, { toValue: 0, duration: 500 }).start()
    }
  }

  render () {
    return (
      <Animated.View style={this.styles.wrapper}>
        <AutoScrollIcon style={this.styles.icon} />
      </Animated.View>
    )
  }
}

export default AutoScrollArea
