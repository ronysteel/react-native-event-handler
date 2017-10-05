// @flow
import React from 'react'
import { Text, View, FlatList, StyleSheet } from 'react-native'

import GridItem from './GridItem'
import type { Novel } from '../reducers/novels'
import type { Recommend } from '../reducers/recommends'

const getRecommends = (recommends, novel) =>
  recommends.reduce((memo, v) => {
    if (v.novelId !== novel.novelId) {
      memo.push(v)
    }
    return memo
  }, [])

type Props = {
  novel: Novel,
  recommends: Array<Recommend>,
  onSelectContent: Function
}

class Recommends extends React.PureComponent<void, Props, void> {
  render () {
    const { novel, recommends, onSelectContent } = this.props

    if (!recommends) {
      return null
    }

    return (
      <View style={styles.container}>
        <View style={styles.sectionWrapper}>
          <Text style={styles.text}>{'こんなノベルもおすすめ'}</Text>
        </View>
        <FlatList
          data={getRecommends(recommends, novel)}
          renderItem={GridItem.bind(
            null,
            onSelectContent.bind(null, 'recommend')
          )}
          numColumns={2}
          keyExtractor={item => `${item.id}`}
        />
      </View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  sectionWrapper: {
    position: 'relative',
    paddingHorizontal: 15,
    marginTop: 25,
    marginBottom: 25
  },
  text: {
    color: '#000',
    fontSize: 24,
    fontWeight: '600'
  }
})

export default Recommends
