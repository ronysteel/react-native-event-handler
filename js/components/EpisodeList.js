// @flow
import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet
} from 'react-native'
import Svg, { Path } from 'react-native-svg'

import Header from './ListHeader'

const ChatBubbleIcon = () => (
  <View>
    <Svg width='30' height='30' viewBox='0 0 30 30'>
      <Path
        d='M28.955 28.406l-1.833-6.212.108-.186c1.255-2.163 1.926-4.622 1.926-7.18C29.156 6.915 22.74.5 14.828.5 6.915.5.5 6.915.5 14.828c0 7.913 6.415 14.328 14.328 14.328 2.703 0 5.295-.75 7.542-2.143l.208-.13 5.722 2.133c.102.038.213.042.316.01.265-.077.417-.355.34-.62z'
        stroke='#000'
        fill='none'
      />
    </Svg>
  </View>
)

const onPress = (closeModal, onSelectContent) => {
  onSelectContent()

  // 次の画面がスタックされてから
  // 裏側で見えないようにモーダルを閉じる
  setTimeout(() => closeModal(), 500)
}

const Separator = () => <View style={styles.separator} />

const Footer = () => <View style={styles.footer} />

const renderItem = (novel, closeModal, onSelectContent, { item, index }) => (
  <TouchableOpacity
    onPress={onPress.bind(
      null,
      closeModal,
      onSelectContent.bind(null, index, item)
    )}
  >
    <View style={styles.container}>
      <View style={styles.leftWrapper}>
        <ChatBubbleIcon />
        <View style={styles.bubbleTextWrapper}>
          <Text style={styles.bubbleText}>{item.episodeOrder}</Text>
        </View>
      </View>
      <View style={styles.rightWrapper}>
        <Text style={styles.novelTitle}>{novel.title}</Text>
        <Text style={styles.episodeTitle}>{item.title}</Text>
      </View>
    </View>
  </TouchableOpacity>
)

/**
 * @param onSelectContent (positionIndex, item) => void
 */
const EpisodeList = ({ novel, episodes, closeModal, onSelectContent }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
      <Header title={'エピソード一覧'} closeModal={closeModal} />

      <FlatList
        data={episodes}
        renderItem={renderItem.bind(null, novel, closeModal, onSelectContent)}
        keyExtractor={item => `${item.episodeOrder}`}
        ItemSeparatorComponent={Separator}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  leftWrapper: {
    marginLeft: 15,
    justifyContent: 'center'
  },
  rightWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20
  },
  separator: {
    marginLeft: 15,
    borderBottomWidth: 0.5,
    borderColor: '#d6d6d6'
  },
  novelTitle: {
    fontSize: 15,
    color: '#000',
    marginBottom: 10
  },
  episodeTitle: {
    fontSize: 15,
    color: '#000'
  },
  bubbleTextWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bubbleText: {
    color: '#000',
    fontSize: 15,
    backgroundColor: 'transparent'
  }
})

export default EpisodeList
