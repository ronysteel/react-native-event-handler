// @flow

export type Action =
  { type: 'LOAD_STORIES_SUCCESS', stories: Array<Object> }
  | { type: 'LOAD_STORY_SUCCESS', story: { id: number, episodes: Array<Object> } }
  | { type: 'LOAD_EPISODE_SUCCESS', episode: { id: number, scripts: Array<Object> } }
  | { type: 'UPDATE_READ_STATE', episodeId: number, scripts: any, readIndex: ?number }
  | { type: 'UPDATE_PAGE_VIEW' }
  | { type: 'SIGN_IN_ANONYMOUSLY_SUCCESS', user: any }
  ;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any
export type GetState = () => Object
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any
export type PromiseAction = Promise<Action>
