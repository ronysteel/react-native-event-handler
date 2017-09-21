// @flow
import React from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

import type { Novel } from '../reducers/novels'
import type { Episode } from '../reducers/episodes'

const SCREEN_WIDTH = Dimensions.get('window').width

type Props = {
  novel: Novel,
  episode: Episode,
  onSelectContent: Function
}

class NextEpisode extends React.PureComponent<Props> {
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.sectionWrapper}>
          <Text style={styles.text}>{'このノベルの続きを読む'}</Text>
        </View>
        <TouchableOpacity
          focusedOpacity={1}
          activeOpacity={1}
          onPress={this.props.onSelectContent.bind(
            null,
            'next_episode',
            0,
            this.props.episode
          )}
        >
          <Image
            style={styles.thumbnail}
            source={{ uri: this.props.novel.thumbnailUrl }}
          />
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{this.props.episode.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  sectionWrapper: {
    paddingHorizontal: 15,
    marginTop: 25,
    marginBottom: 25
  },
  text: {
    color: '#000',
    fontSize: 24,
    fontWeight: '600'
  },
  thumbnail: {
    width: SCREEN_WIDTH - 60,
    aspectRatio: 315 / 210,
    alignSelf: 'center',
    borderRadius: 6
  },
  titleWrapper: {
    marginLeft: 30,
    marginTop: 15,
    marginBottom: 40
  },
  title: {
    fontSize: 16,
    fontWeight: '600'
  }
})

export default NextEpisode
