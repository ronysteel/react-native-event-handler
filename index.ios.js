import { AppRegistry } from 'react-native'
import { init } from './js/crashlytics'
import Root from './js'
// import Playground from './js/Playground'

init()
AppRegistry.registerComponent('chatnovel', () => Root)
// AppRegistry.registerComponent('chatnovel', () => Playground)
