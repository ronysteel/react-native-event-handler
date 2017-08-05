// @flow
import React from 'react'
import { Text, View, FlatList, StyleSheet } from 'react-native'

import GridItem from './GridItem'

const getRecommends = (recommends, novel) => (
  recommends.reduce((memo, v) => {
    if (v.novelId !== novel.novelId) {
      memo.push(v)
    }
    return memo
  }, [])
)

const Recommends = ({ novel, recommends, onSelectContent }) => (
  <View>
    <View style={ styles.sectionWrapper }>
      <View style={ styles.border } />
      <View style={ styles.textWrapper }>
        <Text style={ styles.text }>{ 'こんなノベルもおすすめ' }</Text>
      </View>
    </View>
    <FlatList
      data={ getRecommends(recommends, novel) }
      renderItem={ GridItem.bind(null, onSelectContent.bind(null, 'recommend')) }
      numColumns={ 2 }
      keyExtractor={item => `${item.id}`}
    />
  </View>
)

const styles: StyleSheet = StyleSheet.create({
  sectionWrapper: {
    position: 'relative',
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  border: {
    borderWidth: 0.5,
    borderColor: '#3a3a3a',
  },
  textWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  text: {
    color: '#fff',
    backgroundColor: '#212121',
    marginTop: -14 / 2,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
})

export default Recommends
