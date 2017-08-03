// @flow
import React from 'react'
import { View, StatusBar } from 'react-native'

import Share from './components/Share'

StatusBar.setHidden(true)
StatusBar.setBarStyle('dark-content')

class Playground extends React.PureComponent {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Share
          novel={{
            novelId: 1,
            categoryId: 1,
          }}
          readState={{
            readIndex: 1,
            backgroundImageIndex: 0,
            displayPromotion: false,
            reachEndOfContent: true,
          }}
          shareText={ "怖かった…？ \n怖かったらこのノベルをシェアしよう…" }
          shareOptions={{
            title: "title",
            url: "url",
          }}
          recommends={[{
            novelId: 2,
            episodeId: 2,
            title: 'test',
            description: 'desc',
            episodeUri: 'url',
            thumbnailUrl: "https://s3-ap-northeast-1.amazonaws.com/chatnovel/thumbnails/16x9/couples_cake.jpg",
          }, {
            novelId: 2,
            episodeId: 2,
            title: 'test',
            description: 'desc',
            episodeUri: 'url',
            thumbnailUrl: "https://s3-ap-northeast-1.amazonaws.com/chatnovel/thumbnails/16x9/couples_cake.jpg",
          }]}
        />
      </View>
    )
  }
}
export default Playground
