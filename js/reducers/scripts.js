// @flow
import type { Action } from '../actions/types'

const convertEnum = ary =>
  ary.reduce((memo, v, i) => {
    memo[v] = i
    return memo
  }, {})

type TextCharactor = {
  name: string;
}
const textTypes = [
  'UNKNOWN',
  'NORMAL',
]
const textTypeNumber = convertEnum(textTypes)
type TextType = $Keys<typeof textTypeNumber>;

type Text = {
  body: string;
  type: TextType;
  charactor: ?TextCharactor;
}

const scriptTypes = [
  'UNKNOWN',
  'TEXT',
]
const scriptTypeNumber = convertEnum(scriptTypes)
type ScriptType = $Keys<typeof scriptTypeNumber>;

export type Script = {
  id: number;
  scriptOrder: number;
  type: ScriptType;

  text: ?Text;
}

export type Scripts = {
  [id: number]: Script;
}

const initialStates: Scripts = {}

function scripts(state: Scripts = initialStates, action: Action): Scripts {
  switch (action.type) {
    case 'LOAD_EPISODE_SUCCESS':
      if (!action.episode.scripts) {
        return state
      }

      const scripts = action.episode.scripts.reduce((memo, v) => {
        const s = v.script
        s.type = scriptTypes[s.type]
        if (s.type === 'TEXT') {
          s.text.type = textTypes[s.text.type]
        }

        memo[s.id] = s
        return memo
      }, {})
      return Object.assign({}, state, scripts)

    default:
      return state
  }
}

export default scripts
