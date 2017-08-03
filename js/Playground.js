// @flow
import React from 'react'
import { View, StatusBar } from 'react-native'

import ScriptList from './components/ScriptList'

StatusBar.setHidden(true)
StatusBar.setBarStyle('dark-content')

class Playground extends React.PureComponent {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScriptList
          data={[
            {
              id: 1,
              scriptOrder: 1,
              type: 'TEXT',
              text: {
                body: "すみません。解決策をご用意していたのですが、ちょっと準備に時間がかかってしまって……",
                characterId: "0",
                type: 'CHAT_LEFT',
              },
            },
            {
              id: 2,
              scriptOrder: 2,
              type: 'TEXT',
              text: {
                body: "すみません。解決策をご用意していたのですが、ちょっと準備に時間がかかってしまって……",
                characterId: "0",
                type: 'CHAT_RIGHT',
              },
            },
            {
              id: 3,
              scriptOrder: 2,
              type: 'TEXT',
              text: {
                body: "すみません。解決策をご用意していたのですが、ちょっと準備に時間がかかってしまって……",
                characterId: "1",
                type: 'CHAT_LEFT',
              },
            },
            {
              id: 4,
              scriptOrder: 2,
              type: 'TEXT',
              text: {
                body: "すみません。解決策をご用意していたのですが、ちょっと準備に時間がかかってしまって……",
                characterId: "1",
                type: 'CHAT_RIGHT',
              },
            },
            {
              id: 5,
              scriptOrder: 2,
              type: 'IMAGE',
              image: {
                type: 'CHAT_LEFT',
                characterId: '0',
                imageUrl: "https://s3-ap-northeast-1.amazonaws.com/obake.me/dummy-images/jumping-cat.jpg",
              },
            },
            {
              id: 6,
              scriptOrder: 2,
              type: 'IMAGE',
              image: {
                type: 'CHAT_LEFT',
                characterId: '1',
                imageUrl: "https://s3-ap-northeast-1.amazonaws.com/obake.me/dummy-images/jumping-cat.jpg",
              },
            },
            {
              id: 7,
              scriptOrder: 2,
              type: 'IMAGE',
              image: {
                type: 'CHAT_RIGHT',
                characterId: '1',
                imageUrl: "https://s3-ap-northeast-1.amazonaws.com/obake.me/dummy-images/jumping-cat.jpg",
              },
            },
            {
              id: 8,
              scriptOrder: 2,
              type: 'IMAGE',
              image: {
                type: 'NORMAL',
                characterId: '1',
                imageUrl: "https://s3-ap-northeast-1.amazonaws.com/obake.me/dummy-images/jumping-cat.jpg",
                imageWidth: 631,
                imageHeight: 450,
              },
            },
          ]}
          lastItemId={ 10 }
          readState={{
            episodeId: 1,
            readIndex: 100,
            backgroundImageIndex: 1,
            displayPromotion: false,
            reachEndOfContent: false,
          }}
          characters={{
            "0": {
              name: 'A',
              avatarUrl: "https://s3-ap-northeast-1.amazonaws.com/chatnovel/character_icon/hoagehgowheg.png",
            },
            "1": {
              name: '謎の人',
              avatarUrl: "",
            }
          }}
          isTutorial={ false }
          ListFooterComponent={ () => null }
        />
      </View>
    )
  }
}
export default Playground
