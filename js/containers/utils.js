import { Platform, Linking, Alert } from 'react-native'
import Share from 'react-native-share'
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
        ...{
          message: `${options.title} @CHATNOVEL`,
          social: 'twitter'
        }
      }).catch(() => {})
    }
    case 'facebook': {
      return Share.shareSingle({
        ...options,
        ...{
          message: `${options.title}`,
          social: 'facebook'
        }
      }).catch(() => {})
    }
    case 'line': {
      const path = encodeURIComponent(`${options.title}\n${options.url}`)
      const url = `line://msg/text/${path}`
      return Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            Alert.alert('エラー', 'LINEがインストールされていません')
          } else {
            return Linking.openURL(url)
          }
        })
        .catch(() => {})
    }
    case 'link': {
      return Share.open({
        message: `${options.title}`,
        url: options.url
      }).catch(() => {})
    }
  }
}

export const requestReviewPopup = () => {
  Alert.alert(
    'CHAT NOVELをレビューする',
    'いつもご利用いただきましてありがとうございます！\nこれからも面白いノベルを作る励みになりますので☆5のレビューをお願いします！',
    [
      {
        text: '☆5をつける',
        onPress: () => {
          Linking.openURL(
            'itms-apps://itunes.apple.com/jp/app/id1263726333?action=write-review'
          )
        }
      },
      {
        text: 'バグ・改善してほしい',
        onPress: () => {
          Linking.openURL(
            'mailto:chatnovel-info@newn.co?subject=CHAT NOVELバグ・改善要望'
          )
        }
      },
      { text: 'また今度', onPress: () => {} }
    ]
  )
}
