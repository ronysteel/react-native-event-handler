// @flow
import type { Action, ThunkAction } from './types'
import { NavigationActions } from 'react-navigation'

export function resetNavigator (): Action {
  return NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })]
  })
}

export function navigateNovel (novelId: string, episodeId: string): Action {
  return NavigationActions.navigate({
    routeName: 'EpisodeDetail',
    params: { novelId, episodeId }
  })
}

export function navigateNovelFromNotification (
  novelId: string,
  episodeId: string
): Action {
  return NavigationActions.reset({
    index: 1,
    actions: [
      NavigationActions.navigate({ routeName: 'Home' }),
      NavigationActions.navigate({
        routeName: 'EpisodeDetail',
        params: {
          novelId,
          episodeId
        }
      })
    ]
  })
}

export function navigateAboutTerms (): Action {
  return NavigationActions.navigate({
    routeName: 'Terms'
  })
}

export function navigateAboutPrivacy (): Action {
  return NavigationActions.navigate({
    routeName: 'PrivacyPolicy'
  })
}

export function navigateAboutSubscription (): Action {
  return NavigationActions.navigate({
    routeName: 'AboutSubscription'
  })
}
