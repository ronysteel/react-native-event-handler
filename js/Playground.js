// @flow
import React from 'react'
import { View, ScrollView, StatusBar } from 'react-native'

import Share from './components/Share'
import NextEpisode from './components/NextEpisode'

StatusBar.setHidden(false)
StatusBar.setBarStyle('dark-content')

class Playground extends React.PureComponent {
  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Share
          novel={{}}
          shareText={ 'Foo' }
          readState={{
            reachEndOfContent: true,
          }}
          shareOptions={{}}
          recommends={[]}
          onSelectContent={ () => {} }
          onPressShare={ () => {} }
        />

        <NextEpisode
          novel={{
            thumbnailUrl: 'https://s3-ap-northeast-1.amazonaws.com/chatnovel/thumbnails/16x9/couples_cake.jpg',
          }}
          episode={{
            title: 'エピソード2「夏の終わり」',
          }}
          onSelectContent={ () => {} }
        />
      </ScrollView>
    )
  }
}
export default Playground
