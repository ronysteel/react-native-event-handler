// @flow

import React from 'react'
import { View, StatusBar, AsyncStorage, Linking } from 'react-native'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import { Provider } from 'react-redux'
import { StackNavigator } from 'react-navigation'

import reducers from './reducers'
import Home from './containers/Home'
import StoryDetail from './containers/StoryDetail'
import EpisodeDetail from './containers/EpisodeDetail'
import { signInAnonymously } from './actions/user'

function setupStore(onComplete: () => void) {
  const _createStore = applyMiddleware(thunk)(createStore)
  const store = autoRehydrate()(_createStore)(reducers)
  persistStore(store, { storage: AsyncStorage }, onComplete);

  return store
}

const App = StackNavigator({
  Home: { screen: Home },
  StoryDetail: { screen: StoryDetail },
  EpisodeDetail: { screen: EpisodeDetail, path: 'novels/:novelId/episodes/:episodeId' },
}, {
  headerMode: 'screen',
});

class Root extends React.Component {
  state: {
    isLoading: boolean;
    store: any;
  }

  constructor() {
    super()
    StatusBar.setBarStyle('light-content')
    this.state = {
      isLoading: true,
      store: undefined,
    }

    this.state.store = setupStore((err, state) => {
      this.setState({ isLoading: false })
    })
    this.state.store.dispatch(signInAnonymously())
  }

  render() {
    if (this.state.isLoading) {
      return null
    }
    return (
      <Provider store={this.state.store}>
        <App uriPrefix={ 'chatnovel://' } />
      </Provider>
    )
  }
}

export default Root
