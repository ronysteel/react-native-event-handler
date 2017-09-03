// @flow
import type { Action } from '../actions/types'

const convertEnum = ary =>
  ary.reduce((memo, v, i) => {
    memo[v] = i
    return memo
  }, {})

type TextCharacter = {
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
  character: ?TextCharacter;
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

const imageTypes = [
  'UNKNOWN',
  'NORMAL',
  'CHAT_LEFT',
  'CHAT_RIGHT',
]
const imageTypeNumber = convertEnum(imageTypes)
type ImageType = $Keys<typeof imageTypeNumber>;
type Image = {
  type: ImageType;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  characterId: ?number;
}

const scriptTypes = [
  'UNKNOWN',
  'TEXT',
  'BACKGROUND_IMAGE',
  'DESCRIPTION',
  'IMAGE',
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
  image: ?Image;
}

export type Scripts = {
  [episodeId: string]: {
    [scriptId: number]: Script
  }
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

      const scripts = Object.values(action.episode.scripts).reduce((memo, v) => {
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
          case 'IMAGE': {
            s.image.type = imageTypes[s.image.type]
            break
          }
        }

        memo[s.id] = s
        return memo
      }, {})

      return { ...state, [action.episodeId]: scripts }
    }

    default:
      return state
  }
}

export const getAllScript = (episode: Episode, scripts: Scripts): IndexedScripts => {
  if (!episode || !episode.scriptIds) {
    return {}
  }
  return episode.scriptIds.reduce((memo, id) => {
    const s = scripts[episode.id][id]
    memo[s.scriptOrder] = s
    return memo
  }, {})
}

export const getText = (episode: Episode, scripts: Scripts, readIndex: number) => {
  if (!episode || !episode.scriptIds) {
    return
  }

  const ids = episode.scriptIds.slice(0, readIndex).reverse()
  for (let i = 0; i < ids.length; i++) {
    const s = scripts[episode.id][ids[i]]
    if (s.type === 'TEXT') {
      return s
    }
  }

  return
}
