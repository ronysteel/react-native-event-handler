import React from 'react'
import renderer from 'react-test-renderer'

import Stories from './Stories'

it('renders without crashing', () => {
  const component = (
    <Stories
      sections={ [] }
      onSelectContent={ () => {} }
    />
  )
  const rendered = renderer.create(component).toJSON()
  expect(rendered).toBeTruthy()
})
