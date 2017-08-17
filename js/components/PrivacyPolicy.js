// @flow
import React from 'react'
import { WebView } from 'react-native'

const PrivacyPolicy = () => (
  <WebView
    source={{ uri: 'http://newn.co/privacy.html' }}
    decelerationRate={ 0.998 }
  />
)
PrivacyPolicy.navigationOptions = () => ({
  title: 'プライバシーポリシー'
})

export default PrivacyPolicy
