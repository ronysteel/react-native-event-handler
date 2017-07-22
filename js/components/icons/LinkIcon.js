// @flow
import React from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, {
  Path,
} from 'react-native-svg'

import commonStyle from './iconStyleSheet'

const LinkIcon = ({ style }) => (
  <View style={ [ styles.container, style ] }>
    <View style={ styles.wrapper }>
      <Svg width="20" height="18" viewBox="0 0 20 18">
        <Path
          d="M3.175 14.727c-1.21-1.44-1.02-3.595.42-4.804l3.37-2.828-1.343-1.6-3.37 2.827c-2.326 1.952-2.63 5.423-.678 7.75 1.95 2.324 5.422 2.628 7.748.677l3.37-2.83-1.343-1.6-3.37 2.828c-1.442 1.21-3.596 1.02-4.805-.42zm4.16-2.056l6.743-5.656-1.414-1.685-6.742 5.656 1.414 1.685zM10.68 1.25l-3.37 2.83 1.343 1.6 3.37-2.828c1.442-1.21 3.596-1.02 4.805.42 1.21 1.442 1.02 3.596-.42 4.805l-3.37 2.828 1.343 1.6 3.37-2.827c2.326-1.952 2.63-5.423.678-7.75-1.95-2.324-5.422-2.628-7.748-.677z"
          fill="#FFF"
        />
      </Svg>
    </View>
  </View>
)

const styles: StyleSheet = StyleSheet.create(
  Object.assign({}, commonStyle, {
    container: Object.assign({}, commonStyle.container, {
      backgroundColor: '#535353',
    })
  })
)

export default LinkIcon
