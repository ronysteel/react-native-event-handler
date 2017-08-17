// @flow
import React from 'react'
import { WebView } from 'react-native'

const Terms = () => (
  <WebView
    source={{ uri: 'http://newn.co/terms.html' }}
    decelerationRate={ 0.998 }
  />
)
Terms.navigationOptions = () => ({
  title: '利用規約'
})

export default Terms
