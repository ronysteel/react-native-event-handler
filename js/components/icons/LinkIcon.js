// @flow
import React from 'react'
import Svg, { Path } from 'react-native-svg'
import Share from 'react-native-share';

import BaseIcon from './BaseIcon'

const LinkIcon = ({ onPress, options, style }) => (
  <BaseIcon onPress={ onPress.bind(null, options) } bgColor={ '#535353' } style={ style }>
    <Svg width="20" height="18" viewBox="0 0 20 18">
      <Path
        d="M3.175 14.727c-1.21-1.44-1.02-3.595.42-4.804l3.37-2.828-1.343-1.6-3.37 2.827c-2.326 1.952-2.63 5.423-.678 7.75 1.95 2.324 5.422 2.628 7.748.677l3.37-2.83-1.343-1.6-3.37 2.828c-1.442 1.21-3.596 1.02-4.805-.42zm4.16-2.056l6.743-5.656-1.414-1.685-6.742 5.656 1.414 1.685zM10.68 1.25l-3.37 2.83 1.343 1.6 3.37-2.828c1.442-1.21 3.596-1.02 4.805.42 1.21 1.442 1.02 3.596-.42 4.805l-3.37 2.828 1.343 1.6 3.37-2.827c2.326-1.952 2.63-5.423.678-7.75-1.95-2.324-5.422-2.628-7.748-.677z"
        fill="#FFF"
      />
    </Svg>
  </BaseIcon>
)

export default LinkIcon
