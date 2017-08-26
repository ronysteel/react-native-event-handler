import React from 'react'
import renderer from 'react-test-renderer'

import BackgroundImage from './BackgroundImage'

describe('renders without crashing', () => {
  it('imageUrl is null', () => {
    const component = (
      <BackgroundImage
        imageUrl={ null }
      />
    )
    const rendered = renderer.create(component).toJSON()
    expect(rendered).toBeTruthy()
  })

  it('imageUrl is string', () => {
    const component = (
      <BackgroundImage
        imageUrl={ "" }
      />
    )
    const rendered = renderer.create(component).toJSON()
    expect(rendered).toBeTruthy()
  })
})
