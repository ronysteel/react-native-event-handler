import { Linking } from 'react-native'
import Share from 'react-native-share';
import { selectContent } from '../actions/app'

/**
 * @param item Novel
 */
export const onSelectContent = (dispatch, sectionIndex: string, positionIndex: number, item) => {
  Linking.openURL(item.episodeUri)
  dispatch(selectContent(sectionIndex, positionIndex))
}

export const onPressShare = (type: string, options) => {
  switch (type) {
    case 'twitter': {
      return Share.shareSingle({
        ...options,
        ...({ social: "twitter" }),
      })
      .catch(() => {})
    }
    case 'facebook': {
      return Share.shareSingle({
        ...options,
        ...({ social: "facebook" }),
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
            console.log('Can\'t handle url: ' + url)
          } else {
            return Linking.openURL(url)
          }
        })
        .catch(() => {})
    }
    case 'link': {
      return Share.open({
        title: options.title,
        message: options.message,
        url: options.url,
      })
      .catch(() => {})
    }
  }
}
