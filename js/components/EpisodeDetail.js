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

class CustomScrollView extends React.PureComponent {
  render() {
    return (
      <ScrollView
        style={ styles.containers }
        ref={ref => this.scrollView = ref}
      >
        <View {...this.props} style={ styles.containers } />
      </ScrollView>
    )
  }
}

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

  renderFooter(readState) {
    let height = tapAreaHeight
    if (readState.reachEndOfContent) {
      height = 30
    }

    return (
      <View style={{ height }} />
    )
  }

  scrollToEnd() {
    this.isScrolling = true
    this.storyWrapper.scrollToEnd()
  }

  setContentHeight(contentHeight) {
    setTimeout(() => this.scrollToEnd(), 0)
  }

  onLayout(event) {
    this.setContentHeight(event.nativeEvent.layout.height)
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

    const scrollView = props => {
      return (
        <CustomScrollView {...props} />
      )
    }

    const lastItemId = scriptValues.length == 0 ? 0 : scriptValues[scriptValues.length - 1].id
    const bgImageUrl = getBackgroundImage(scripts, readState)
    const shareOptions = this.getShareOptions(novel, shareLinks)

    return (
      <View style={ styles.container }>
        <BackgroundImage imageUrl={ bgImageUrl } />
        <TapArea onPress={ onTapScreen } />
        <ScrollView
          scrollEventThrottle={ 16 }
          onScroll={ Animated.event(
            [ { nativeEvent: { contentOffset: { y: this.state.scrollAnim } } } ],
          ) }
          ref={r => this.storyWrapper = r}
          onTouchStart={ () => this.isTappable = true }
          onScrollBeginDrag={ () => this.isTappable = false }
          onTouchEnd={() => {
            if (this.isTappable) {
              onTapScreen()
            }
            this.isTappable = false
          }}
        >
          <FlatList
            ref={r => this.list = r}
            data={ scriptValues }
            renderItem={ renderItem.bind(null, lastItemId, readState, characters) }
            keyExtractor={ item => `${item.id}` }
            ListFooterComponent={ this.renderFooter.bind(this, readState) }
            onLayout={ this.onLayout.bind(this) }
          />
          <Share
            novel={ novel }
            readState={ readState }
            shareText={ "怖かった…？ \n怖かったらこのノベルをシェアしよう…" }
            shareOptions={ shareOptions }
            recommends={ recommends }
          />
        </ScrollView>
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
})

export default EpisodeDetail
