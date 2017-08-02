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
  TouchableWithoutFeedback,
} from 'react-native'

import BackgroundImage from './BackgroundImage'
import Share from './Share'
import ScriptText from './scripts/ScriptText'
import ScriptDescription from './scripts/ScriptDescription'
import ScriptImage from './scripts/ScriptImage'
import TapArea from './TapArea'

import type { Episode } from '../reducers/episodes'
import type { Scripts } from '../reducers/scripts'

type Props = {
  episode: Episode;
  scripts: IndexedScripts;
  onTapScreen: Function;
}

const headerHeight = 64
const windowHeight = Dimensions.get('window').height - headerHeight
const tapAreaHeight = 250

const renderItem = (lastItemId, readState, characters, { item, index }) => {
  const isLatestItem = index === (readState.readIndex - 1)
  if (index >= readState.readIndex) {
    return null
  }

  switch (item.type) {
    case 'TEXT': {
      return <ScriptText
        text={ item.text }
        isLatestItem={ isLatestItem }
        characters={ characters }
      />
    }
    case 'DESCRIPTION': {
      return <ScriptDescription
        description={ item.description }
        isLatestItem={ isLatestItem }
      />
    }
    case 'IMAGE': {
      return <ScriptImage
        image={ item.image }
        isLatestItem={ isLatestItem }
        characters={ characters }
      />
    }
  }

  return null
}

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

class EpisodeDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      resumed: false,
      height: windowHeight,
      contentHeight: 0,
      completed: false,
      scrollAnim: new Animated.Value(0),
      isLocked: false,
      offsetFromEnd: new Animated.Value(0),
    }
    this.isTappable = false
  }

  componentDidMount() {
    this.state.scrollAnim.addListener(this.handleScroll);
  }

  componentWillUnmount() {
    this.state.scrollAnim.removeListener(this.handleScroll);
  }

  handleScroll = ({ value }) => {
    this.previousScrollvalue = this.currentScrollValue;
    this.currentScrollValue = value;

    const delta = this.currentScrollValue - this.previousScrollvalue
    if (delta < -20) {
      this.props.showHeader()
    } else if (this.currentScrollValue >= 0 && delta > 15) {
      this.props.hideHeader()
    }
  }

  _handleScroll = ({ nativeEvent }) => {
    Animated.event([{
      nativeEvent: { contentOffset: { y: this.state.scrollAnim } }
    }])

    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent
    const offsetFromEnd = (layoutMeasurement.height - (contentSize.height - contentOffset.y))

    if (this.state.isLocked && Math.abs(offsetFromEnd) < 1) {
      this.setState({ isLocked: false })
      this.state.offsetFromEnd.setValue(0)
    }
    if (!this.state.isLocked) {
      this.state.offsetFromEnd.setValue(Math.abs(offsetFromEnd))
    }
  }

  renderFooter(readState, isTutorial) {
    let height = tapAreaHeight
    if (readState.reachEndOfContent && !isTutorial) {
      height = 30
    }

    return (
      <View style={{ height }} />
    )
  }

  scrollToEnd() {
    this.storyWrapper.scrollToEnd()
  }

  onTap = (e) => {
    this.isTappable = true
  }

  onTapEnd = (onTapScreen) => {
    if (this.isTappable && !this.state.isLocked) {
      onTapScreen()
      this.setState({ isLocked: true })
      setTimeout(() => this.scrollToEnd(), 0)
      setTimeout(() => {
        if (this.state.isLocked) {
          this.setState({ isLocked: false })
        }
      }, 280)
    }
    this.isTappable = false
  }

  getShareOptions = (novel, shareLinks) => {
    if (!novel || !shareLinks) {
      return null
    }
    return {
      title: novel.title,
      url: shareLinks.default,
    }
  }

  render() {
    const {
      novel, episode, scripts, scriptValues, readState, shareLinks, recommends,
      isTutorial, characters, onTapScreen, onTapPurchase,
    } = this.props

    const lastItemId = scriptValues.length == 0 ? 0 : scriptValues[scriptValues.length - 1].id
    const bgImageUrl = getBackgroundImage(scripts, readState)
    const shareOptions = this.getShareOptions(novel, shareLinks)

    return (
      <View style={ styles.container }>
        <BackgroundImage imageUrl={ bgImageUrl } />
        <TapArea
          offset={ this.state.offsetFromEnd }
          readState={ readState }
        />
        <ScrollView
          scrollEventThrottle={ 16 }
          onScroll={ this._handleScroll }
          ref={r => this.storyWrapper = r}
          onTouchStart={ this.onTap }
          onScrollBeginDrag={ () => this.isTappable = false }
          onTouchEnd={ this.onTapEnd.bind(this, onTapScreen) }
        >
          <FlatList
            ref={r => this.list = r}
            data={ scriptValues }
            renderItem={ renderItem.bind(null, lastItemId, readState, characters) }
            keyExtractor={ item => `${item.id}` }
            ListFooterComponent={ this.renderFooter.bind(this, readState, isTutorial) }
          />
          <Share
            novel={ novel }
            readState={ readState }
            shareText={ "怖かった…？ \n怖かったらこのノベルをシェアしよう…" }
            shareOptions={ shareOptions }
            recommends={ recommends }
          />
        </ScrollView>
        <View style={[ styles.tapGuard, this.state.isLocked ? {top:0} : {} ]} />
      </View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBackground: {
    backgroundColor: '#212121',
  },
  tapGuard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})

export default EpisodeDetail
