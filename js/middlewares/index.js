import { AsyncStorage } from 'react-native'
import { compose, applyMiddleware, createStore, combineReducers } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk'
import reducers from '../reducers'
import track from './track'

const middlewares = []
middlewares.push(thunk)
middlewares.push(track)
if (__DEV__) {
  const { logger } = require(`redux-logger`)
  middlewares.push(logger)
}

function configureStore (onComplete: () => void) {
  const _createStore = compose(applyMiddleware(...middlewares))(createStore)
  const store = autoRehydrate()(_createStore)(reducers)
  persistStore(store, { storage: AsyncStorage }, onComplete)

  return store
}

export default configureStore
