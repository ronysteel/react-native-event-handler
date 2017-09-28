//
// Original source:
// https://github.com/skv-headless/react-native-scrollable-tab-view/blob/master/ScrollableTabBar.js
//
import React from 'react'
import {
  View,
  Animated,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  I18nManager
} from 'react-native'

const Button = props => {
  return <TouchableOpacity {...props}>{props.children}</TouchableOpacity>
}

const WINDOW_WIDTH = Dimensions.get('window').width

type Props = {
  goToPage: Function,
  activeTab: number,
  tabs: Array<any>,
  backgroundColor: string,
  activeTextColor: string,
  inactiveTextColor: string,
  scrollOffset: number,
  style: any,
  tabStyle: any,
  tabsContainerStyle: any,
  textStyle: any,
  renderTab: Function,
  onScroll: Function,
  opacity: any
}

class ScrollableTabBar extends React.PureComponent<Props> {
  _tabsMeasurements = []
  scrollValue = new Animated.Value(0)
  state = {
    _leftTabUnderline: new Animated.Value(0),
    _widthTabUnderline: new Animated.Value(0),
    _containerWidth: null
  }

  componentDidMount () {
    this.scrollValue.addListener(this.updateView)
  }

  updateView (offset) {
    const position = Math.floor(offset.value)
    const pageOffset = offset.value % 1
    const tabCount = this.props.tabs.length
    const lastTabPosition = tabCount - 1

    if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
      return
    }

    if (
      this.necessarilyMeasurementsCompleted(
        position,
        position === lastTabPosition
      )
    ) {
      this.updateTabPanel(position, pageOffset)
      this.updateTabUnderline(position, pageOffset, tabCount)
    }
  }

  necessarilyMeasurementsCompleted (position, isLastTab) {
    return (
      this._tabsMeasurements[position] &&
      (isLastTab || this._tabsMeasurements[position + 1]) &&
      this._tabContainerMeasurements &&
      this._containerMeasurements
    )
  }

  updateTabPanel (position, pageOffset) {
    const containerWidth = this._containerMeasurements.width
    const tabWidth = this._tabsMeasurements[position].width
    const nextTabMeasurements = this._tabsMeasurements[position + 1]
    const nextTabWidth = (nextTabMeasurements && nextTabMeasurements.width) || 0
    const tabOffset = this._tabsMeasurements[position].left
    const absolutePageOffset = pageOffset * tabWidth
    let newScrollX = tabOffset + absolutePageOffset

    // center tab and smooth tab change (for when tabWidth changes a lot between two tabs)
    newScrollX -=
      (containerWidth -
        (1 - pageOffset) * tabWidth -
        pageOffset * nextTabWidth) /
      2
    newScrollX = newScrollX >= 0 ? newScrollX : 0

    if (Platform.OS === 'android') {
      this._scrollView.scrollTo({ x: newScrollX, y: 0, animated: false })
    } else {
      const rightBoundScroll =
        this._tabContainerMeasurements.width - this._containerMeasurements.width
      newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX
      this._scrollView.scrollTo({ x: newScrollX, y: 0, animated: false })
    }
  }

  updateTabUnderline (position, pageOffset, tabCount) {
    const lineLeft = this._tabsMeasurements[position].left
    const lineRight = this._tabsMeasurements[position].right

    if (position < tabCount - 1) {
      const nextTabLeft = this._tabsMeasurements[position + 1].left
      const nextTabRight = this._tabsMeasurements[position + 1].right

      const newLineLeft = pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft
      const newLineRight =
        pageOffset * nextTabRight + (1 - pageOffset) * lineRight

      this.state._leftTabUnderline.setValue(newLineLeft)
      this.state._widthTabUnderline.setValue(newLineRight - newLineLeft)
    } else {
      this.state._leftTabUnderline.setValue(lineLeft)
      this.state._widthTabUnderline.setValue(lineRight - lineLeft)
    }
  }

  renderTab (name, page, isTabActive, onPressHandler, onLayoutHandler) {
    const { activeTextColor, inactiveTextColor, textStyle } = this.props
    const textColor = isTabActive ? activeTextColor : inactiveTextColor
    const fontWeight = isTabActive ? 'bold' : 'normal'

    return (
      <Button
        key={`${name}_${page}`}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits='button'
        onPress={() => onPressHandler(page)}
        onLayout={onLayoutHandler}
      >
        <View style={[styles.tab, this.props.tabStyle]}>
          <Text style={[{ color: textColor, fontWeight }, textStyle]}>
            {name}
          </Text>
        </View>
      </Button>
    )
  }

  measureTab (page, event) {
    const { x, width, height } = event.nativeEvent.layout
    this._tabsMeasurements[page] = { left: x, right: x + width, width, height }
    this.updateView({ value: this.scrollValue._value })
  }

  render () {
    const key = I18nManager.isRTL ? 'right' : 'left'

    return (
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: this.props.backgroundColor },
          this.props.style
        ]}
        onLayout={this.onContainerLayout.bind(this)}
      >
        <ScrollView
          automaticallyAdjustContentInsets={false}
          ref={scrollView => {
            this._scrollView = scrollView
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled={true}
          onScroll={this.props.onScroll}
          bounces={false}
          scrollsToTop={false}
        >
          <View
            style={[
              styles.tabs,
              { width: this.state._containerWidth },
              this.props.tabsContainerStyle
            ]}
            ref={'tabContainer'}
            onLayout={this.onTabContainerLayout.bind(this)}
          >
            {this.props.tabs.map((name, page) => {
              const isTabActive = this.props.activeTab === page
              const renderTab =
                this.props.renderTab || this.renderTab.bind(this)
              return renderTab(
                name,
                page,
                isTabActive,
                this.props.goToPage,
                this.measureTab.bind(this, page)
              )
            })}
          </View>
        </ScrollView>
      </Animated.View>
    )
  }

  componentWillReceiveProps (nextProps) {
    // If the tabs change, force the width of the tabs container to be recalculated
    if (
      JSON.stringify(this.props.tabs) !== JSON.stringify(nextProps.tabs) &&
      this.state._containerWidth
    ) {
      this.setState({ _containerWidth: null })
    }
  }

  onTabContainerLayout (e) {
    this._tabContainerMeasurements = e.nativeEvent.layout
    let width = this._tabContainerMeasurements.width
    if (width < WINDOW_WIDTH) {
      width = WINDOW_WIDTH
    }
    this.setState({ _containerWidth: width })
    this.updateView({ value: this.scrollValue._value })
  }

  onContainerLayout (e) {
    this._containerMeasurements = e.nativeEvent.layout
    this.updateView({ value: this.scrollValue._value })
  }
}

ScrollableTabBar.defaultProps = {
  scrollOffset: 52,
  activeTextColor: 'navy',
  inactiveTextColor: 'black',
  backgroundColor: null,
  style: {},
  tabStyle: {},
  tabsContainerStyle: {}
}

const styles = StyleSheet.create({
  tab: {
    height: 49,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  container: {
    height: 50,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc'
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})

export default ScrollableTabBar
