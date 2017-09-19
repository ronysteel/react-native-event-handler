// @flow
import type { Action, ThunkAction } from './types'
import moment from 'moment'
import firebase from '../firebase'
import { getText } from '../reducers/scripts'
import { log } from '../logging'

export function sendTutorialBeginEvent (episodeId: string): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('tutorial_begin', {
          item_id: episodeId
        })
      )
      .catch(() => {})
  }
}

export function sendTutorialCompleteEvent (episodeId: string): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('tutorial_complete', {
          item_id: episodeId
        })
      )
      .catch(() => {})
  }
}

export function sendTutorialLeaveEvent (episodeId: string): ThunkAction {
  return (dispatch, getState) => {
    const { readStates } = getState()

    if (!readStates[episodeId]) {
      return new Promise(resolve => resolve())
    }

    if (readStates[episodeId] && readStates[episodeId].reachEndOfContent) {
      return new Promise(resolve => resolve())
    }

    const readIndex = readStates[episodeId].readIndex

    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('tutorial_leave', {
          item_id: episodeId,
          content_type: 'novel',
          script_id: readIndex
        })
      )
      .catch(() => {})
  }
}

export function sendSelectContentEvent (
  novelId: number,
  episodeId: number
): ThunkAction {
  return (dispatch, getState) => {
    const { novels, episodes, actionLog } = getState()

    return new Promise(resolve => resolve())
      .then(() => {
        const novel = novels[novelId]
        const episode = episodes[episodeId]

        firebase.analytics().logEvent('select_content', {
          item_id: episodeId,
          content_type: 'novel',

          title: novel.title,
          category: novel.categoryId,
          episode: episode.episodeOrder,

          referer: actionLog.prevScreen.type.toLowerCase(),
          referer_section: actionLog.position.sectionIndex,
          referer_position: actionLog.position.positionIndex
        })
      })
      .catch(err => {
        log('sendSelectContentEvent', err)
      })
  }
}

export function sendLeaveContentEvent (episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    const { readStates } = getState()

    if (!readStates[episodeId]) {
      return new Promise(resolve => resolve())
    }

    if (readStates[episodeId] && readStates[episodeId].reachEndOfContent) {
      return new Promise(resolve => resolve())
    }

    const readIndex = readStates[episodeId].readIndex

    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('leave_content', {
          item_id: episodeId,
          content_type: 'novel',
          script_id: readIndex
        })
      )
      .then(() => {
        // Cancel all local notifications
        firebase.messaging().cancelLocalNotification('*')

        const { characters, episodes, scripts } = getState()
        const episodeCharacters = characters[episodeId]
        const script = getText(episodes[episodeId], scripts, readIndex)

        if (!script) {
          return
        }

        const { characterId, body } = script.text
        const name = episodeCharacters[characterId].name
        const { episodeUri } = episodes[episodeId]

        firebase.messaging().scheduleLocalNotification({
          id: 'LEAVE_CONTENT_1',
          body: `${name}: ${body}`,
          fire_date: moment()
            .add(1, 'hours')
            .valueOf(),
          episodeUri,
          episodeId
        })

        firebase.messaging().scheduleLocalNotification({
          id: 'LEAVE_CONTENT_2',
          body: `${name}: ${body}`,
          fire_date: moment()
            .add(1, 'days')
            .valueOf(),
          episodeUri,
          episodeId
        })
      })
      .catch(err => {
        console.error(err)
      })
  }
}

export function sendCompleteContentEvent (episodeId: string): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('complete_content', {
          item_id: episodeId,
          content_type: 'novel'
        })
      )
      .catch(() => {})
  }
}

export function sendPromotionEvent (
  episodeId: number,
  hasTweetButton: boolean = false
): ThunkAction {
  let withPromotion = {}
  if (hasTweetButton) {
    withPromotion = {
      with_promotion: 'tweet'
    }
  }

  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('promotion', {
          item_id: episodeId,
          content_type: 'novel',
          ...withPromotion
        })
      )
      .catch(() => {})
  }
}

export function sendShareEvent (
  episodeId: number,
  shareType: string
): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('share', {
          item_id: episodeId,
          content_type: 'novel',
          share_type: shareType
        })
      )
      .catch(() => {})
  }
}

export function sendShareCompleteEvent (
  episodeId: number,
  shareType: string
): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('share_complete', {
          item_id: episodeId,
          content_type: 'novel',
          share_type: shareType
        })
      )
      .catch(() => {})
  }
}

export function sendSpendVirtualCurrencyEvnet (): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('spend_virtual_currency', {
          item_name: 'ticket',
          virtual_currency_name: 'ticket',
          value: 1
        })
      )
      .catch(() => {})
  }
}

export function sendPresentOfferEvnet (): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('present_offer', {
          item_id: 'ticket1',
          item_name: 'ticket1',
          item_category: 'ticket'
        })
      )
      .catch(() => {})
  }
}

export function sendPromotionShareBeginEvnet (episodeId: number): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('promotion_share_begin', {
          item_id: episodeId,
          content_type: 'novel'
        })
      )
      .catch(() => {})
  }
}

export function sendPromotionShareCompleteEvnet (
  episodeId: number
): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('promotion_share_complete', {
          item_id: episodeId,
          content_type: 'novel'
        })
      )
      .catch(() => {})
  }
}

export function sendLocalNotificationOpenEvent (episodeId: string): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('local_notification_open', {
          item_id: episodeId,
          content_type: 'novel'
        })
      )
      .catch(() => {})
  }
}

export function sendNotificationOpenEvent (): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() =>
        firebase.analytics().logEvent('global_notification_open', {})
      )
      .catch(() => {})
  }
}

export function sendPushAllowEvent (): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() => firebase.analytics().logEvent('push_allow'))
      .catch(() => {})
  }
}

export function sendPushDenyEvent (): ThunkAction {
  return (dispatch, getState) => {
    return new Promise(resolve => resolve())
      .then(() => firebase.analytics().logEvent('push_deny'))
      .catch(() => {})
  }
}
