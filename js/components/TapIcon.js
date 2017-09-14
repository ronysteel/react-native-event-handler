// @flow
import React from 'react'
import Svg, { G, Circle } from 'react-native-svg'

const TapIcon = ({ theme }) => {
  let color = '#000'
  if (theme == 'dark') {
    color = '#fff'
  }

  return (
    <Svg width='44' height='44' viewBox='0 0 44 44'>
      <G fillOpacity='.3' fill={color}>
        <Circle cx='22' cy='22' r='22' />
        <Circle cx='22' cy='22' r='18' />
      </G>
    </Svg>
  )
}

export default TapIcon
