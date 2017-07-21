// @flow
import React from 'react'
import { View, Text, TouchableOpacity, Platform, StatusBar, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Svg, {
  Path,
} from 'react-native-svg'

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0
const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 56

const ArrowIcon = () => (
  <View style={ styles.arrowIcon }>
    <Svg width="9" height="15" viewBox="0 0 9 15">
      <Path d="M7.985 13.85L1.62 7.484 7.986 1.12"
        strokeWidth="1.5"
        stroke="#000"
        fill="none"
        fillRule="evenodd"
      />
    </Svg>
  </View>
)

class StoryHeader extends React.PureComponent {
  static HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT

  navigateBack = () => {
    this.props.navigation.goBack(null)
    StatusBar.setHidden(false)
  }

  render() {
    return (
      <View style={ styles.container }>
        <LinearGradient
          colors={['rgba(0, 0, 0, .3)', 'transparent']}
          style={ styles.linearGradient }
        >
          <TouchableOpacity onPress={ this.navigateBack }>
            <View style={ styles.backButton }>
              <ArrowIcon />
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  backButton: {
    borderRadius: 32 / 2,
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    marginTop: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 1,
    shadowOpacity: .45,
  },
  arrowIcon: {
    marginLeft: -1,
    alignSelf: 'center',
  },
})

export default StoryHeader
