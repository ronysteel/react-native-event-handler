// @flow
import React from 'react'
import Svg, { Path, G, Circle } from 'react-native-svg'

const AutoScrollIcon = ({ theme }) => {
  let color = '#707070'

  return (
    <Svg width='46' height='46' viewBox='0 0 46 46'>
      <G stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
        <Circle stroke={color} stroke-width='1.5' cx='23' cy='23' r='22' />
        <Path
          d='M15,14 L21.12,14 L21.12,33 L15,33 L15,14 Z M25.88,14 L32,14 L32,33 L25.88,33 L25.88,14 Z'
          fill={color}
        />
      </G>
    </Svg>
  )
}

export default AutoScrollIcon
