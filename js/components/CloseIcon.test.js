import React from 'react'
import renderer from 'react-test-renderer'

import CloseIcon from './CloseIcon'

describe('renders without crashing', () => {
  it('', () => {
    const component = (
      <CloseIcon color={ '#fff' } />
    )
    const rendered = renderer.create(component).toJSON()
    expect(rendered).toBeTruthy()
  })
})
