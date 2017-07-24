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

const Recommends = ({ novel, recommends }) => (
  <FlatList
    data={ getRecommends(recommends, novel) }
    renderItem={ GridItem }
    numColumns={ 2 }
    keyExtractor={item => `${item.id}`}
  />
)

const styles: StyleSheet = StyleSheet.create({})

export default Recommends
