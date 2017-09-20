import { parseNovelUri, compareAppVersion } from './index'

describe('parseNovelUri', () => {
  it('', () => {
    const params = parseNovelUri(
      'chatnovel://novels/01BPGRVG5DP32HK9M4WZGS69YY/episodes/01BPGRVG5F6N3PHEWW5Q71KHMB'
    )
    expect(params).toEqual({
      novelId: '01BPGRVG5DP32HK9M4WZGS69YY',
      episodeId: '01BPGRVG5F6N3PHEWW5Q71KHMB'
    })
  })

  it('', () => {
    const params = parseNovelUri(
      'chatnovel://novels/01BPGRVG5DP32HK9M4WZGS69YY/episodes'
    )
    expect(params).toBe(null)
  })

  it('', () => {
    const params = parseNovelUri(
      'foo://novels/01BPGRVG5DP32HK9M4WZGS69YY/episodes/01BPGRVG5F6N3PHEWW5Q71KHMB'
    )
    expect(params).toBe(null)
  })
})

describe('compareAppVersion', () => {
  it('', () => {
    const params = compareAppVersion('1.0.0', '1.0.0')
    expect(params).toBe(false)
  })

  it('', () => {
    const params = compareAppVersion('1.0.0', '1.1.0')
    expect(params).toBe(true)
  })

  it('', () => {
    const params = compareAppVersion('1.0.0', '1.0.1')
    expect(params).toBe(false)
  })

  it('', () => {
    const params = compareAppVersion('1.0.0', '2.0.0')
    expect(params).toBe(true)
  })

  it('', () => {
    const params = compareAppVersion('abc', 'def')
    expect(params).toBe(false)
  })
})
