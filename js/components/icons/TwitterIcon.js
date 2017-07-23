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
}

const onPress = () => {
  Share.shareSingle(Object.assign({}, shareOptions, {
    "social": "twitter"
  }))
  .catch((err) => { err && console.log(err) })
}

const TwitterIcon = ({ style }) => (
  <BaseIcon onPress={ onPress } bgColor={ '#55acee' } style={ style }>
    <Svg width="26" height="21" viewBox="0 0 26 21">
      <Path
        d="M25.75 2.534c-.93.412-1.93.692-2.98.817 1.07-.64 1.894-1.658 2.28-2.87-1.002.594-2.113 1.026-3.295 1.26C20.808.73 19.46.1 17.965.1c-2.866 0-5.19 2.324-5.19 5.19 0 .407.046.803.135 1.183C8.596 6.257 4.77 4.19 2.212 1.05c-.448.767-.703 1.658-.703 2.61 0 1.8.915 3.39 2.308 4.32-.85-.027-1.65-.26-2.35-.65-.002.022-.002.044-.002.066 0 2.515 1.79 4.613 4.164 5.09-.436.118-.894.18-1.367.18-.335 0-.66-.03-.977-.09.66 2.06 2.577 3.56 4.85 3.603-1.778 1.39-4.016 2.22-6.448 2.22-.42 0-.832-.024-1.238-.072C2.747 19.8 5.475 20.66 8.407 20.66c9.547 0 14.768-7.91 14.768-14.768 0-.225-.005-.45-.016-.672 1.014-.73 1.894-1.645 2.59-2.686z"
        fill="#FFF"
      />
    </Svg>
  </BaseIcon>
)

export default TwitterIcon
