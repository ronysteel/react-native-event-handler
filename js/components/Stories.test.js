import React from 'react'
import renderer from 'react-test-renderer'

import Stories from './Stories'

it('renders without crashing', () => {
  const rendered = renderer.create(<Stories />).toJSON()
  expect(rendered).toBeTruthy()
})
