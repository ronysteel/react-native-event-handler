// @flow
import Config from 'react-native-config'
import pathToRegexp from 'path-to-regexp'

const URL_SCHEME = Config.URL_SCHEME

const uriToPath = (uri: string): string => {
  const delimiter = `chatnovel://`
  let path = uri.split(delimiter)[1]
  if (typeof path === 'undefined') {
    path = uri
  }

  return path
}

const NOVEL_URI = 'novels/:novelId/episodes/:episodeId'

type novelUriParams = {
  novelId: string,
  episodeId: string
}

export const parseNovelUri = (uri: string): ?novelUriParams => {
  const path = uriToPath(uri)
  const keys = []
  const re = pathToRegexp(NOVEL_URI, keys)
  const ps = re.exec(path)

  if (ps === null) {
    return null
  }

  const params = keys.reduce((memo, v, i) => {
    memo[v.name] = ps[i + 1]
    return memo
  }, {})

  return params
}
