// @flow
import React from 'react'
import Svg, { Path } from 'react-native-svg'
import Share from 'react-native-share';

import BaseIcon from './BaseIcon'

let shareOptions = {
  title: "React Native",
  message: "Hola mundo",
  url: "http://facebook.github.io/react-native/",
  subject: "Share Link",
};

const onPress = () => {
  Share.shareSingle(Object.assign({}, shareOptions, {
    "social": "facebook"
  }))
  .catch((err) => { err && console.log(err) })
}

const FacebookIcon = ({ style }) => (
  <BaseIcon onPress={ onPress } bgColor={ '#3b5998' } style={ style }>
    <Svg width="14" height="26" viewBox="0 0 14 26">
      <Path
        d="M9.108 25.1V14.06h3.705l.555-4.3h-4.26V7.012c0-1.245.346-2.095 2.13-2.095h2.28v-3.85C13.124 1.02 11.77.9 10.198.9 6.914.9 4.665 2.905 4.665 6.586V9.76H.95v4.3h3.715V25.1h4.443"
        fill="#FFF"
      />
    </Svg>
  </BaseIcon>
)

export default FacebookIcon
