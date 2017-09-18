// @flow
import React from 'react'
import { FlatList } from 'react-native'

import ScriptText from './scripts/ScriptText'
import ScriptDescription from './scripts/ScriptDescription'
import ScriptImage from './scripts/ScriptImage'

const renderItem = (lastItemId, readState, characters, { item, index }) => {
  const isLatestItem = index === readState.readIndex - 1
  if (index >= readState.readIndex) {
    return null
  }

  switch (item.type) {
    case 'TEXT': {
      return (
        <ScriptText
          text={item.text}
          isLatestItem={isLatestItem}
          characters={characters}
        />
      )
    }
    case 'DESCRIPTION': {
      return (
        <ScriptDescription
          description={item.description}
          isLatestItem={isLatestItem}
        />
      )
    }
    case 'IMAGE': {
      return (
        <ScriptImage
          image={item.image}
          isLatestItem={isLatestItem}
          characters={characters}
        />
      )
    }
  }

  return null
}

class ScriptList extends React.PureComponent {
  list = null

  render () {
    const {
      data,
      lastItemId,
      readState,
      characters,
      isTutorial,
      ListFooterComponent,
      onLayout,
      style
    } = this.props
    return (
      <FlatList
        ref={r => this.list = r}
        data={data}
        renderItem={renderItem.bind(null, lastItemId, readState, characters)}
        keyExtractor={item => `${item.id}`}
        ListFooterComponent={ListFooterComponent}
        onLayout={() => {
          console.warn("onLayout called")
          this.props.onLayout(this.list._listRef.state)
        }}
        style={style}
      />
    )
  }
}

export default ScriptList
