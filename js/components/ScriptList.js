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
  _list = null

  listRef = () => {
    return this._list._listRef
  }

  render () {
    const {
      data,
      lastItemId,
      readState,
      characters,
      isTutorial,
      ListFooterComponent,
      style
    } = this.props
    return (
      <FlatList
        ref={r => (this._list = r)}
        initialNumToRender={data.length}
        data={data}
        renderItem={renderItem.bind(null, lastItemId, readState, characters)}
        keyExtractor={item => `${item.id}`}
        ListFooterComponent={ListFooterComponent}
        style={style}
      />
    )
  }
}

export default ScriptList
