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
} from 'react-native'

import BackgroundImage from './BackgroundImage'
import Promotion from './Promotion'
import Share from './Share'
import ScriptText from './scripts/ScriptText'
import ScriptDescription from './scripts/ScriptDescription'

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
        <TouchableOpacity
          focusedOpacity={1}
          activeOpacity={1}
          onPress={() => {
            this.props.onTapScreen()
          }}
          style={{
            backgroundColor: 'transparent',
          }}>
          <View {...this.props} style={ styles.containers } />
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const renderItem = (lastItemId, { item }) => {
  const isLatestItem = item.id === lastItemId

  switch (item.type) {
    case 'TEXT': {
      return <ScriptText text={ item.text } isLatestItem={ isLatestItem } />
    }
    case 'DESCRIPTION': {
      return <ScriptDescription description={ item.description } isLatestItem={ isLatestItem } />
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
    let height = this.state.height
    if (readState.reachEndOfContent) {
      height = 30
    }
    return <View style={{ height }} />
  }

  scrollToEnd() {
    this.storyWrapper.scrollToEnd()
  }

  setContentHeight(contentHeight) {
    const h = windowHeight - (contentHeight - this.state.height)
    if (h <= tapAreaHeight) {
      this.state.height = tapAreaHeight
    } else {
      this.state.height = h
    }

    this.setState({ height: this.state.height })
    setTimeout(() => this.scrollToEnd(), 0)
  }

  onLayout(event) {
    this.setContentHeight(event.nativeEvent.layout.height)
  }

  getShareOptions = (novel, shareLinks) => {
    if (!novel || !shareLinks) {
      return { title: '', url: '' }
    }
    return {
      title: novel.title,
      url: shareLinks.default,
    }
  }

  render() {
    const {
      novel, episode, scripts, readState, paid, shareLinks, recommends,
      onTapScreen, onTapPurchase,
    } = this.props

    const scrollView = props => {
      return (
        <CustomScrollView {...props}
          onTapScreen={ onTapScreen }
        />
      )
    }
    const values = Object.values(scripts)
    const lastItemId = values.length == 0 ? 0 : values[values.length - 1].id
    const bgImageUrl = getBackgroundImage(scripts, readState)
    const shareOptions = this.getShareOptions(novel, shareLinks)

    return (
      <View style={ styles.container }>
        <BackgroundImage imageUrl={ bgImageUrl } />
        <ScrollView
          scrollEventThrottle={ 16 }
          onScroll={ Animated.event(
            [ { nativeEvent: { contentOffset: { y: this.state.scrollAnim } } } ],
          ) }
          ref={r => this.storyWrapper = r}
        >
          <FlatList
            ref={r => this.list = r}
            data={ values }
            renderItem={ renderItem.bind(null, lastItemId) }
            keyExtractor={ item => `${item.id}` }
            renderScrollComponent={ scrollView }
            ListFooterComponent={ this.renderFooter.bind(this, readState) }
            onLayout={ this.onLayout.bind(this) }
          />
          <Promotion
            paid={ paid }
            readState={ readState }
            onTapPurchase={ onTapPurchase }
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
    backgroundColor: '#1a1a1a',
  },
})

export default EpisodeDetail
