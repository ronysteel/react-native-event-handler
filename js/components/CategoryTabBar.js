// @flow
import React from 'react'
import {
  View,
  Animated,
  StyleSheet
} from 'react-native'
import { ScrollableTabBar } from 'react-native-scrollable-tab-view'

class CategoryTabBar extends React.PureComponent {
  render () {
    return (
      <ScrollableTabBar
        {...this.props}
        backgroundColor={'#fff'}
        activeTextColor={'#000'}
        inactiveTextColor={'#b3b3b3'}
        style={styles.container}
        tabStyle={styles.tab}
        underlineStyle={styles.underline}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    borderWidth: 0,
  },
  tab: {
    height: 36,
    paddingLeft: 15,
    paddingRight: 15,
  },
  underline: {
    height: 0,
    borderWidth: 0
  }
})

export default CategoryTabBar
