import React from 'react'
import renderer from 'react-test-renderer'

import Stories from './Stories'

jest.mock('SectionList', () => {
  const RealComponent = require.requireActual('SectionList')
  const React = require('React')
  class SectionList extends React.Component {
    render() {
      delete this.props.getScrollableNode
      return React.createElement('SectionList', this.props, this.props.children)
    }
  }
  SectionList.propTypes = RealComponent.propTypes
  return SectionList
})


it('renders without crashing', () => {
  const component = <Stories sections={[]} onSelectContent={() => {}} />
  const rendered = renderer.create(component).toJSON()
  expect(rendered).toBeTruthy()
})
