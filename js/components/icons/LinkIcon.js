// @flow
import React from 'react'
import Svg, { Path } from 'react-native-svg'
import Share from 'react-native-share'

import BaseIcon from './BaseIcon'

const LinkIcon = ({ onPress, options, style }) => (
  <BaseIcon
    onPress={onPress.bind(null, options)}
    bgColor={'#535353'}
    style={style}
  >
    <Svg width='20' height='19' viewBox='0 0 20 19'>
      <Path
        d='M3.136 15.01c-1.21-1.44-1.02-3.594.42-4.803l3.37-2.828-1.342-1.602-3.37 2.828c-2.326 1.95-2.63 5.423-.68 7.75 1.953 2.324 5.424 2.628 7.75.676l3.37-2.828-1.343-1.6-3.37 2.827c-1.44 1.21-3.595 1.022-4.804-.42zm4.162-2.055l6.74-5.657-1.413-1.685-6.74 5.657 1.413 1.685zm3.342-11.42l-3.37 2.83 1.343 1.6 3.37-2.83c1.44-1.208 3.595-1.02 4.804.422 1.21 1.44 1.02 3.595-.42 4.804l-3.37 2.83 1.343 1.6 3.37-2.828c2.326-1.952 2.63-5.423.678-7.75-1.95-2.324-5.423-2.628-7.748-.677z'
        fill='#FFF'
      />
    </Svg>
  </BaseIcon>
)

export default LinkIcon
