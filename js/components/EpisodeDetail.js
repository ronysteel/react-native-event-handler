// @flow
import React from 'react'
import {
  Animated,
  Dimensions,
  ScrollView,
  FlatList,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import _ from 'lodash'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'

import AutoScrollArea from './AutoScrollArea'
import BackgroundImage from './BackgroundImage'
import Share from './Share'
import TapArea from './TapArea'
import ScriptList from './ScriptList'
import Recommends from './Recommends'
import NextEpisode from './NextEpisode'

import type { Episode } from '../reducers/episodes'
import type { Scripts } from '../reducers/scripts'

type Props = {
  episode: Episode,
  scripts: IndexedScripts,
  onTapScreen: Function
}

const headerHeight = 64
const windowHeight = Dimensions.get('window').height - headerHeight
const tapAreaHeight = 250

const getBackgroundImage = (scripts, readState) => {
  if (!readState) {
    return null
  }
  if (readState.backgroundImageIndex == 0) {
    return null
  }
  if (!scripts[readState.backgroundImageIndex]) {
    return null
  }
  return scripts[readState.backgroundImageIndex].backgroundImage.imageUrl
}

class EpisodeDetail extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      resumed: false,
      height: windowHeight,
      contentHeight: 0,
      completed: false,
      scrollAnim: new Animated.Value(0),
      isLocked: false,
      offsetFromEnd: new Animated.Value(0),
      renderCompleted: false,
      autoScrolling: false
    }
    this.isTappable = false
  }

  componentDidMount () {
    this.state.scrollAnim.addListener(this.handleScroll)
  }

  componentWillUnmount () {
    this.state.scrollAnim.removeListener(this.handleScroll)
  }

  handleScroll = ({ value }) => {
    this.previousScrollvalue = this.currentScrollValue
    this.currentScrollValue = value

    const delta = this.currentScrollValue - this.previousScrollvalue
    if (delta < -10) {
      this.props.showHeader()
    } else if (this.currentScrollValue >= 0 && delta > 15) {
      this.props.hideHeader()
    }
  }

  _handleScroll = e => {
    Animated.event([
      {
        nativeEvent: { contentOffset: { y: this.state.scrollAnim } }
      }
    ])(e)

    const { nativeEvent } = e
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent
    const offsetFromEnd =
      layoutMeasurement.height - (contentSize.height - contentOffset.y)

    this.requestAnimationFrame(() => {
      if (this.state.isLocked && Math.abs(offsetFromEnd) < 10) {
        this.state.isLocked = false
      }
      if (!this.state.isLocked) {
        if (offsetFromEnd < 0) {
          this.state.offsetFromEnd.setValue(Math.abs(offsetFromEnd))
        }
      }
    })
  }

  renderFooter (readState, isTutorial) {
    let height = tapAreaHeight
    if (readState.reachEndOfContent && !isTutorial) {
      height = 30
    }

    return <View style={{ height }} onLayout={this.onLayoutFooter.bind(this)} />
  }

  scrollToEnd (params: Object = {}) {
    // unmount 後に呼ばれることがある
    if (!this.storyWrapper) {
      return
    }
    this.storyWrapper.scrollToEnd(params)
  }

  autoScrollStart = () => {
    if (this.isTappable !== null) {
      if (
        this.props.readState.readIndex < this.props.scriptValues.length &&
        !this.props.readState.displayPromotion
      ) {
        this.setState({ autoScrolling: true })
        this.props.onAutoScrollStart()
        this.autoScroll()
      } else {
        this.forwardToNextScript()
      }
      this.isTappable = null
    }
  }

  autoScrollEnd = () => {
    this.setState({ autoScrolling: false })
    this.clearTimeout(this._autoScrollTimer)
    this.props.onAutoScrollEnd()
  }

  autoScroll = () => {
    if (
      this.props.readState.readIndex < this.props.scriptValues.length &&
      !this.props.readState.displayPromotion
    ) {
      this.forwardToNextScript()
      let script = this.props.scriptValues[this.props.readState.readIndex - 1]
      let scriptLength = 0
      switch (script.type) {
        case 'TEXT':
          scriptLength = script.text.body.length
          break
        case 'DESCRIPTION':
          scriptLength = script.description.body.length
          break
        case 'IMAGE':
          scriptLength = 30
          break
      }
      this._autoScrollTimer = this.setTimeout(
        this.autoScroll,
        910 + 30 * scriptLength
      )
    } else {
      this.autoScrollEnd()
    }
  }

  onTap = e => {
    if (this.state.autoScrolling) {
      this.autoScrollEnd()
    } else {
      this.clearTimeout(this._autoScrollTimer)
      this._autoScrollTimer = this.setTimeout(this.autoScrollStart, 1000)
      this.isTappable = e.nativeEvent
    }
  }

  onTapMove = e => {
    if (this.isTappable !== null) {
      if (
        Math.abs(this.isTappable.locationX - e.nativeEvent.locationX) > 10 ||
        Math.abs(this.isTappable.locationY - e.nativeEvent.locationY) > 10
      ) {
        this.isTappable = null
      }
    }
  }

  onTapEnd = () => {
    if (this.isTappable !== null) {
      this.forwardToNextScript()
      this.isTappable = null
    }
  }

  forwardToNextScript = () => {
    this.props.onTapScreen()
    this.state.isLocked = true
    this.setTimeout(this.scrollToEnd, 0)
    this.setTimeout(this.unlockTapGuard, 500)
  }

  onMomentumScrollEnd = () => {
    this.unlockTapGuard()
  }

  unlockTapGuard () {
    if (this.state.isLocked) {
      this.state.isLocked = false
    }
  }

  getShareOptions = (novel, shareLinks) => {
    if (!novel || !shareLinks) {
      return null
    }
    return {
      title: novel.title,
      url: shareLinks.default
    }
  }

  onLayoutFooter () {
    // Footerコンポーネントのレンダリングがされたタイミングを
    // 全体のレンダリングが完了した判定をするのに使う #235
    if (!this.state.renderCompleted) {
      this.scrollToEnd({ animated: false })
      this.setState({ renderCompleted: true })
    }
  }

  render () {
    const {
      novel,
      episode,
      scripts,
      scriptValues,
      readState,
      shareLinks,
      isTutorial,
      characters,
      onTapScreen,
      onTapPurchase
    } = this.props

    const lastItemId =
      scriptValues.length == 0 ? 0 : scriptValues[scriptValues.length - 1].id
    const bgImageUrl = getBackgroundImage(scripts, readState)
    const shareOptions = this.getShareOptions(novel, shareLinks)

    return (
      <View style={styles.container}>
        <BackgroundImage imageUrl={bgImageUrl} />
        <TapArea
          offset={this.state.offsetFromEnd}
          theme={episode.theme || 'dark'}
          readState={readState}
        />
        <AutoScrollArea autoScrolling={this.state.autoScrolling} />
        <ScrollView
          scrollEventThrottle={16}
          scrollEnabled={!this.state.autoScrolling}
          onScroll={this._handleScroll}
          ref={r => (this.storyWrapper = r)}
          onTouchStart={this.onTap}
          onTouchMove={this.onTapMove}
          onTouchEnd={this.onTapEnd.bind(this)}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
        >
          <ScriptList
            data={scriptValues}
            lastItemId={lastItemId}
            readState={readState}
            characters={characters}
            scrollEnabled={!this.state.autoScrolling}
            ListFooterComponent={this.renderFooter.bind(
              this,
              readState,
              isTutorial
            )}
            style={{
              opacity: this.state.renderCompleted ? 1 : 0
            }}
          />
          {readState.reachEndOfContent && (
            <View>
              <Share
                shareText={(this.props.category || {}).shareTitle}
                shareOptions={shareOptions}
                onSelectContent={this.props.onSelectContent}
                onPressShare={this.props.onPressShare}
              />
              <View style={styles.separator} />
              {this.props.nextEpisode ? (
                <NextEpisode
                  novel={novel}
                  episode={this.props.nextEpisode}
                  onSelectContent={this.props.onSelectContent}
                />
              ) : (
                <Recommends
                  novel={novel}
                  recommends={this.props.recommends}
                  onSelectContent={this.props.onSelectContent}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1
  },
  containerBackground: {
    backgroundColor: '#fff'
  },
  separator: {
    height: 14,
    backgroundColor: '#f3f3f3'
  },
  tapGuard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    opacity: 0
  }
})

reactMixin(EpisodeDetail.prototype, TimerMixin)

export default EpisodeDetail
