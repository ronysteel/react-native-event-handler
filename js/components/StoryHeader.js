// @flow
import React from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Svg, { G, Path } from 'react-native-svg'

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

const EpisodeListIcon = () => (
  <View style={ styles.episodeListIcon }>
    <Svg width="16" height="13" viewBox="0 0 16 13">
      <G fill="#000">
        <Path
          d="M3.648 4.288l1.41.513-2.932 8.055-1.41-.513zM6.423 0h1.5v12.857h-1.5zM9.994 3.57h1.5v9.287h-1.5zM13.566 1.43h1.5v11.428h-1.5z"
        />
      </G>
    </Svg>
  </View>
)

class StoryHeader extends React.PureComponent {
  static HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT

  navigateBack = () => {
    this.props.navigation.goBack(null)
  }

  render() {
    const { visible, openModal } = this.props
    if (!visible) {
      return null
    }
    return (
      <View style={ styles.container }>
        <LinearGradient
          colors={['rgba(0, 0, 0, .3)', 'transparent']}
          style={ styles.linearGradient }
        >
          <TouchableOpacity style={ styles.backButtonWrapper } onPress={ this.navigateBack }>
            <View style={ styles.backButton }>
              <ArrowIcon />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={ styles.episodeListButtonWrapper } onPress={ openModal }>
            <View style={ styles.backButton }>
              <EpisodeListIcon />
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
    flexDirection: 'row',
  },
  backButtonWrapper: {
    flex: 1,
    width: 32 + (15 * 2),
    height: 32 + (15 * 2),
    padding: 15,
  },
  episodeListButtonWrapper: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    width: 32 + (15 * 2),
    height: 32 + (15 * 2),
    padding: 15,
  },
  backButton: {
    borderRadius: 32 / 2,
    width: 32,
    height: 32,
    padding: 15,
    backgroundColor: '#fff',
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
  episodeListIcon: {
    marginLeft: -1,
    alignSelf: 'center',
  },
})

export default StoryHeader
