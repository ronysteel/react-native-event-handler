// @flow
import React from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  SectionList,
  Animated,
  StyleSheet
} from 'react-native'

import PickupItem from './PickupItem'
import ListItem from './ListItem'
import GridItem from './GridItem'
import colors from './colors'

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)

import type { Novel } from '../reducers/Novels'

const renderGridWrapper = (onPress, { item }) => {
  return (
    <FlatList
      data={item.items}
      renderItem={GridItem.bind(null, onPress)}
      numColumns={2}
      keyExtractor={item => `${item.id}`}
      style={{ backgroundColor: '#fff' }}
    />
  )
}

type Props = {
  sections: any,
  onSelectContent: (
    sectionIndex: string,
    positionIndex: number,
    item: Novel
  ) => void,
  onScroll: (number, any) => void
}

type SectionType = 'pickup' | 'grid' | 'list'

class Stories extends React.PureComponent<Props> {
  previousScrollvalue = 0
  currentScrollValue = 0
  state = {
    scrollValue: new Animated.Value(0)
  }

  componentDidMount () {
    this.state.scrollValue.addListener(this.onScroll)
  }

  componentWillUnmount () {
    this.state.scrollValue.removeListener(this.onScroll)
  }

  sections (): { type: SectionType, data: any, renderItem: Function } {
    const { sections, onSelectContent } = this.props

    return sections.map((v, i) => {
      v.data = v.novels
      if (v.type == 'pickup') {
        v.renderItem = PickupItem.bind(
          null,
          onSelectContent.bind(null, `${v.id}`)
        )
      } else if (v.type == 'list') {
        v.renderItem = ListItem.bind(
          null,
          onSelectContent.bind(null, `${v.id}`)
        )
      } else if (v.type == 'grid') {
        v.renderItem = renderGridWrapper.bind(
          null,
          onSelectContent.bind(null, `${v.id}`)
        )
        v.data = [{ items: v.novels, key: 1 }]
      }
      return v
    })
  }

  onScroll = ({ value }) => {
    this.previousScrollvalue = this.currentScrollValue
    this.currentScrollValue = value
    const delta = this.currentScrollValue - this.previousScrollvalue

    if (this.props.onScroll) {
      this.props.onScroll(delta, value)
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <AnimatedSectionList
          renderSectionHeader={({ section }) => {
            if (!section.title) return null
            return (
              <View style={styles.sectionHeader}>
                <View style={styles.sectionSeparator} />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
            )
          }}
          renderItem={() => null}
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
          style={[styles.sectionContainer]}
          keyExtractor={item => `${item.id}`}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollValue } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={1}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f3f3'
  },
  sectionContainer: {
    backgroundColor: '#f3f3f3'
  },
  sectionHeader: {
    backgroundColor: '#fff'
  },
  sectionTitle: {
    paddingLeft: 15,
    color: colors.sectionTitle,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24
  },
  sectionSeparator: {
    backgroundColor: '#f3f3f3',
    height: 8,
    marginBottom: 25
  },
  item: {
    padding: 10,
    fontSize: 18
  }
})

export default Stories
