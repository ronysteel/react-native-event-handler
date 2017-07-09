// @flow
import React from 'react'
import {
  Animated,
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

import type { Episode } from '../reducers/episodes'
import type { Scripts } from '../reducers/scripts'

type Props = {
  episode: Episode;
  scripts: IndexedScripts;
  onTapScreen: Function;
}

class CustomScrollView extends React.Component {
  render() {
    return (
      <ScrollView style={ styles.containers }>
        <TouchableOpacity
          focusedOpacity={1}
          activeOpacity={1}
          onPress={ this.props.onTapScreen }
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
  if (item.dummy) {
    return <View style={{ height: 500 }} />
  }

  const isLatestItem = item.id === lastItemId

  if (item.type === 'TEXT') {
    const textComponent = (
      <View style={ styles.row }>
        { renderCharactorName(item.text) }
        <Text style={ styles.text }>{ item.text.body }</Text>
      </View>
    )
    if (isLatestItem) {
      return <FadeinView>{ textComponent }</FadeinView>
    }
    return textComponent
  }

  return null
}

const getBackgroundImage = (scripts, readState) => {
  if (readState.backgroundImageIndex == 0) {
    return null
  }
  if (!scripts[readState.backgroundImageIndex]) {
    return null
  }
  return scripts[readState.backgroundImageIndex].backgroundImage.imageUrl
}

const EpisodeDetail = ({ episode, scripts, readState, onTapScreen }: Props) => {
  const scrollView = props => {
    return (
      <CustomScrollView {...props} onTapScreen={ onTapScreen } />
    )
  }

  const values = Object.values(scripts)
  const items: any = [
    ...values,
    { dummy: true }
  ]
  const lastItemId = values.length == 0 ? 0 : items[values.length - 1].id
  const bgImageUrl = getBackgroundImage(scripts, readState)

  return (
    <View style={[ styles.container, styles.containerBackground ]}>
      <BackgroundImage imageUrl={ bgImageUrl }>
        <FlatList
          data={ items }
          renderItem={ renderItem.bind(null, lastItemId) }
          keyExtractor={ item => `${item.id}` }
          renderScrollComponent={ scrollView }
        />
      </BackgroundImage>
    </View>
  )
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBackground: {
    backgroundColor: '#fafafa',
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
