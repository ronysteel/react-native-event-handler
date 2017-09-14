import React from 'react'
import renderer from 'react-test-renderer'

import GridItem from './GridItem'

describe('renders without crashing', () => {
  it('', () => {
    let Component = GridItem.bind(null, () => {}, {
      item: {
        title: '',
        description: '',
        thumbnailUrl: '',
        tags: []
      },
      index: 0
    })
    const rendered = renderer.create(<Component />).toJSON()
    expect(rendered).toBeTruthy()
  })
})
