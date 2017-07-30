// @flow
import type { Action, ThunkAction } from './types'
import { StatusBar } from 'react-native'

export function closeSettingModal(): ThunkAction {
  return (dispatch, getState) => {
    return (new Promise(resolve => resolve()))
      .then(() => {
        StatusBar.setBarStyle('light-content')
        StatusBar.setHidden(false)
      })
      .then(() => (
        dispatch({
          type: 'CLOSE_HOME_PAGE_SETTING_MODAL_SUCCESS',
        })
      ))
  }
}

export function openSettingModal(): ThunkAction {
  return (dispatch, getState) => {
    return (new Promise(resolve => resolve()))
      .then(() => {
        StatusBar.setBarStyle('light-content')
        StatusBar.setHidden(false)
      })
      .then(() => (
        dispatch({
          type: 'OPEN_HOME_PAGE_SETTING_MODAL_SUCCESS',
        })
      ))
  }
}

