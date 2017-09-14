import React from 'react'
import renderer from 'react-test-renderer'

import EpisodeList from './EpisodeList'

describe('renders without crashing', () => {
  it('', () => {
    const component = (
      <EpisodeList
        novel={{
          title: ''
        }}
        episodes={[
          {
            episodeOrder: 0,
            title: 'ep 1'
          }
        ]}
        closeModal={() => {}}
        onSelectContent={() => {}}
      />
    )
    const rendered = renderer.create(component).toJSON()
    expect(rendered).toBeTruthy()
  })
})
