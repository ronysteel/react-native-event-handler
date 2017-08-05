import { Linking } from 'react-native'
import { selectContent } from '../actions/app'

/**
 * @param item Novel
 */
export const onSelectContent = (dispatch, sectionIndex: string, positionIndex: number, item) => {
  Linking.openURL(item.episodeUri)
  dispatch(selectContent(sectionIndex, positionIndex))
}
