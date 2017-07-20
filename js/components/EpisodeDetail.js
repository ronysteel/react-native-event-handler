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
import { List, ListItem } from 'react-native-elements'

import FadeinView from './FadeinView'
import BackgroundImage from './BackgroundImage'
import Promotion from './Promotion'

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

class CustomScrollView extends React.Component {
  render() {
    return (
      <ScrollView style={ styles.containers } ref={ref => this.scrollView = ref}>
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

const renderCharactorName = text => {
  if (text.charactor) {
    return <Text style={ styles.charactor }>{ text.charactor.name }</Text>
  }
  return null
}

const renderItem = (lastItemId, { item }) => {
  const isLatestItem = item.id === lastItemId

  if (item.type === 'TEXT') {
    const textComponent = (
      <View style={ styles.row }>
        { renderCharactorName(item.text) }
        <Text style={ styles.text }>{ item.text.body }</Text>
      </View>
    )
    if (isLatestItem) {
      return (
        <FadeinView>
          <View>
            { textComponent }
          </View>
        </FadeinView>
      )
    }
    return textComponent
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
    }
  }

  renderFooter() {
    return <View style={{ height: this.state.height }} />
  }

  scrollToEnd() {
    // FIXME
    this.list._listRef._scrollRef.scrollView.scrollToEnd()
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

  render() {
    const { episode, scripts, readState, paid, onTapScreen, onTapPurchase } = this.props
    const scrollView = props => {
      return (
        <CustomScrollView {...props} onTapScreen={ onTapScreen } />
      )
    }
    const values = Object.values(scripts)
    const lastItemId = values.length == 0 ? 0 : values[values.length - 1].id
    const bgImageUrl = getBackgroundImage(scripts, readState)

    return (
      <View style={[ styles.container, styles.containerBackground ]}>
        <BackgroundImage imageUrl={ bgImageUrl }>
          <FlatList
            ref={r => this.list = r}
            data={ values }
            renderItem={ renderItem.bind(null, lastItemId) }
            keyExtractor={ item => `${item.id}` }
            renderScrollComponent={ scrollView }
            ListFooterComponent={ this.renderFooter.bind(this) }
            onLayout={ this.onLayout.bind(this) }
          />
          <Promotion paid={ paid } readState={ readState } onTapPurchase={ onTapPurchase } />
        </BackgroundImage>
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
  row: {
    margin: 10,
    marginBottom: 0,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 2,
    backgroundColor: '#fff',
    padding: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 16 + 4,
  },
  charactor: {
    fontSize: 12,
    marginBottom: 5,
  }
})

export default EpisodeDetail
