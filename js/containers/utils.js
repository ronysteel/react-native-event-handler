import { Linking, AlertIOS } from 'react-native'
import Share from 'react-native-share';
import { selectContent } from '../actions/app'
import { navigateNovel } from '../actions/navigator'
import { parseNovelUri } from '../utils'
import type { Novel } from '../reducers/novels'

export const onSelectContent = (
  dispatch,
  sectionIndex: string,
  positionIndex: number,
  item: Novel
): void => {
  const params = parseNovelUri(item.episodeUri)
  if (!params) {
    return
  }

  dispatch(navigateNovel(params.novelId, params.episodeId))
  dispatch(selectContent(sectionIndex, positionIndex))
}

export const onPressShare = (type: string, options) => {
  switch (type) {
    case 'twitter': {
      return Share.shareSingle({
        ...options,
        ...({
          message: `${options.title} @CHATNOVEL`,
          social: "twitter",
        }),
      })
        .catch(() => {})
    }
    case 'facebook': {
      return Share.shareSingle({
        ...options,
        ...({
          message: `${options.title}`,
          social: "facebook"
        }),
      })
        .catch(() => {})
    }
    case 'line': {
      const makeUri = (options) => (
        `line://msg/text/${options.title}\n${options.url}`
      )
      const url = makeUri(options)
      return Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            AlertIOS.alert(
              'エラー',
              'LINEがインストールされていません'
            )
          } else {
            return Linking.openURL(url)
          }
        })
        .catch(() => {})
    }
    case 'link': {
      return Share.open({
        message: `${options.title}`,
        url: options.url,
      })
      .catch(() => {})
    }
  }
}
