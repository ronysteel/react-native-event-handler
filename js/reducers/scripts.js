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
  'CHAT_LEFT',
  'CHAT_RIGHT',
]
const textTypeNumber = convertEnum(textTypes)
type TextType = $Keys<typeof textTypeNumber>;

type Text = {
  body: string;
  type: TextType;
  charactor: ?TextCharactor;
}

type BackgroundImage = {
  imageUrl: string;
}

const descriptionTypes = [
  'UNKNOWN',
  'NORMAL',
  'CHAT',
]
const descriptionTypeNumber = convertEnum(descriptionTypes)
type DescriptionType = $Keys<typeof descriptionTypeNumber>;
type Description = {
  type: DescriptionType;
  body: string;
}

const scriptTypes = [
  'UNKNOWN',
  'TEXT',
  'BACKGROUND_IMAGE',
  'DESCRIPTION',
]
const scriptTypeNumber = convertEnum(scriptTypes)
type ScriptType = $Keys<typeof scriptTypeNumber>;

export type Script = {
  id: number;
  scriptOrder: number;
  type: ScriptType;

  text: ?Text;
  backgroundImage: ?BackgroundImage;
  description: ?Description;
}

export type Scripts = {
  [id: number]: Script;
}

//
// key == scriptOrderな構造の型
//
export type IndexedScripts = {
  [id: number]: Script;
}

const initialStates: Scripts = {}

export default function scripts(state: Scripts = initialStates, action: Action): Scripts {
  switch (action.type) {
    case 'LOAD_EPISODE_SUCCESS': {
      if (!action.episode.scripts) {
        return state
      }

      const scripts = action.episode.scripts.reduce((memo, v) => {
        const s = v.script
        s.type = scriptTypes[s.type]

        switch (s.type) {
          case 'TEXT': {
            s.text.type = textTypes[s.text.type]
            break
          }
          case 'DESCRIPTION': {
            s.description.type = descriptionTypes[s.description.type]
            break
          }
        }

        memo[s.id] = s
        return memo
      }, {})

      return Object.assign({}, state, scripts)
    }

    default:
      return state
  }
}

export const getAllScript = (episode: Episode, scripts: Scripts): IndexedScripts => {
  if (!episode) {
    return {}
  }
  return episode.scriptIds.reduce((memo, id) => {
    const s = scripts[id]
    memo[s.scriptOrder] = s
    return memo
  }, {})
}
