import React from 'react'
import renderer from 'react-test-renderer'

import PickupItem from './PickupItem'

describe('renders without crashing', () => {
  it('', () => {
    let Component = PickupItem.bind(null, () => {}, {
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
