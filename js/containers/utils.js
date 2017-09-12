import { Linking, AlertIOS } from 'react-native'
import Share from 'react-native-share';
import { selectContent } from '../actions/app'
import { parseNovelUri } from '../utils'

/**
 * @param item Novel
 */
export const onSelectContent = (navigate, dispatch, sectionIndex: string, positionIndex: number, item) => {
  const params = parseNovelUri(item.episodeUri)
  if (!params) {
    return
  }

  navigate('EpisodeDetail', {
    novelId: params.novelId,
    episodeId: params.episodeId,
  })
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
