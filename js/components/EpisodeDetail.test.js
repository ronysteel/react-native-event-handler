import React from 'react'
import renderer from 'react-test-renderer'

import EpisodeDetail from './EpisodeDetail'

describe('renders without crashing', () => {
  it('', () => {
    const component = (
      <EpisodeDetail
        novel={{ title: '' }}
        episode={{ title: '' }}
        scripts={[]}
        scriptValues={[]}
        readState={{
          readIndex: 0,
          reachEndOfContent: false
        }}
        shareLinks={{ default: '' }}
        recommends={[]}
        isTutorial={false}
        characters={{}}
        onTapScreen={() => {}}
        onTapPurchase={() => {}}
      />
    )
    const rendered = renderer.create(component).toJSON()
    expect(rendered).toBeTruthy()
  })
})
