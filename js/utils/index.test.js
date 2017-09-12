import { parseNovelUri } from './index'

describe('parseNovelUri', () => {
  it('', () => {
    const params = parseNovelUri('chatnovel://novels/01BPGRVG5DP32HK9M4WZGS69YY/episodes/01BPGRVG5F6N3PHEWW5Q71KHMB')
    expect(params).toEqual({
      novelId: '01BPGRVG5DP32HK9M4WZGS69YY',
      episodeId: '01BPGRVG5F6N3PHEWW5Q71KHMB',
    })
  })

  it('', () => {
    const params = parseNovelUri('chatnovel://novels/01BPGRVG5DP32HK9M4WZGS69YY/episodes')
    expect(params).toBe(null)
  })

  it('', () => {
    const params = parseNovelUri('foo://novels/01BPGRVG5DP32HK9M4WZGS69YY/episodes/01BPGRVG5F6N3PHEWW5Q71KHMB')
    expect(params).toBe(null)
  })
})

