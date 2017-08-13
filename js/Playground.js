// @flow
import React from 'react'
import { View, StatusBar } from 'react-native'

import PushPermissionPopup from './components/PushPermissionPopup'

StatusBar.setHidden(false)
StatusBar.setBarStyle('dark-content')

class Playground extends React.PureComponent {
  componentDidMount() {
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <PushPermissionPopup onPress={ () => {} } />
      </View>
    )
  }
}
export default Playground
