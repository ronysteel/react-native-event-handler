// @flow
import React from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import ScrollableTabBar from './ScrollableTabBar'

import {
  STATUSBAR_HEIGHT,
  HEADER_HEIGHT,
  CATEGORY_TABBAR_HEIGHT
} from './constants'

class CategoryTabBar extends React.PureComponent {
  render () {
    return (
      <ScrollableTabBar
        {...this.props}
        backgroundColor={'rgba(255,255,255,0.96)'}
        activeTextColor={'#000'}
        inactiveTextColor={'#b3b3b3'}
        style={[
          styles.container,
          { transform: [{ translateY: this.props.translateY }] }
        ]}
        textStyle={styles.text}
        tabStyle={styles.tab}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: HEADER_HEIGHT + STATUSBAR_HEIGHT,
    left: 0,
    right: 0,
    height: CATEGORY_TABBAR_HEIGHT,
    borderWidth: 0,
    zIndex: 1
  },
  tab: {
    height: CATEGORY_TABBAR_HEIGHT,
    paddingLeft: 15,
    paddingRight: 15
  },
  text: {
    fontSize: 13
  }
})

export default CategoryTabBar
