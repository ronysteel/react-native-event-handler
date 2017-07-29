// @flow
import React from 'react'
import Svg, { Path } from 'react-native-svg'

const CloseIcon = ({ color }) => (
  <Svg width="15" height="15" viewBox="0 0 15 15">
    <Path
      d="M1.416 1.96l-.133.13 5.57 5.57-5.638 5.636.132.133L6.984 7.79l5.966 5.966.133-.132L7.117 7.66l5.898-5.898-.133-.133-5.898 5.897L1.416 1.96z"
      stroke={ color }
      strokeWidth="1.5"
      fill="none"
    />
  </Svg>
)

export default CloseIcon
