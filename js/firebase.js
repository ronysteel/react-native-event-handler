import RNFirebase from 'react-native-firebase'

const instance = RNFirebase.initializeApp({
  debug: __DEV__ ? '*' : false,
  persistence: true,
})

export default instance
