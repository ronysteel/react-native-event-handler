// @flow
import React from 'react'
import { Linking } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import BaseIcon from './BaseIcon'

const makeUri = (options) => (
  `line://msg/text/${options.title}\n${options.url}`
)

const onPress = (options) => {
  const url = makeUri(options)
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url)
      } else {
        return Linking.openURL(url)
      }
    })
    .catch(err => console.log('An error occurred', err))
}

const LineIcon = ({ options, style }) => (
  <BaseIcon onPress={ onPress.bind(null, options) } bgColor={ '#00C300' } style={ style }>
    <Svg width="30" height="29" viewBox="0 0 30 29">
      <Path
        d="M29.85 12.42C29.85 5.695 23.19.25 15 .25S.15 5.718.15 12.42c0 6.026 5.293 11.06 12.43 12.027.48.097 1.15.314 1.318.75.144.387.096.968.048 1.355 0 0-.168 1.065-.215 1.282-.07.387-.287 1.476 1.294.8 1.58-.68 8.55-5.083 11.664-8.712 2.132-2.396 3.162-4.815 3.162-7.5zM9.156 16.414H6.21c-.43 0-.79-.363-.79-.798V9.663c0-.436.36-.8.79-.8.43 0 .79.364.79.8v5.178h2.18c.43 0 .79.364.79.8-.024.435-.383.773-.814.773zm3.066-.774c0 .435-.36.798-.79.798-.432 0-.79-.363-.79-.8V9.664c0-.436.358-.8.79-.8.43 0 .79.364.79.8v5.976zm7.113 0c0 .338-.215.628-.527.75-.072.023-.167.048-.24.048-.24 0-.478-.12-.622-.315l-3.042-4.186v3.702c0 .435-.36.798-.79.798-.43 0-.79-.363-.79-.8V9.664c0-.34.215-.63.526-.75.072-.025.168-.05.24-.05.24 0 .48.122.623.316l3.017 4.16V9.663c0-.436.36-.8.79-.8.432 0 .79.364.79.8v5.976h.025zm4.767-3.776c.43 0 .79.363.79.8 0 .434-.36.797-.79.797h-2.18v1.405h2.18c.43 0 .79.363.79.798 0 .436-.36.8-.79.8h-2.946c-.432 0-.79-.364-.79-.8v-6c0-.436.358-.8.79-.8h2.946c.43 0 .79.364.79.8 0 .435-.36.798-.79.798h-2.18v1.404h2.18z"
        fill="#FFF"
      />
    </Svg>
  </BaseIcon>
)

export default LineIcon