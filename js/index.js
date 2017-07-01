import React from 'react'
import { AsyncStorage } from 'react-native'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import { Provider } from 'react-redux'

import reducers from './reducers'
import App from './containers/App'

const _createStore = applyMiddleware(thunk)(createStore)
const store = autoRehydrate()(_createStore)(reducers)
persistStore(store, { storage: AsyncStorage }, () => {
  console.log('rehydration complete')
});

const Root = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default Root
