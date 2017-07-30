// @flow
import React from 'react'
import {
  Text,
  View,
  StyleSheet,
} from 'react-native'
import moment from 'moment'

class RechargeCountdown extends React.Component {
  state = {
    duration: null,
  }

  loop() {
    let sub = moment(this.props.nextRechargeDate).valueOf() - moment().valueOf()
    if (sub < 0) sub = 0

    this.setState({
      duration: moment.duration(sub)
    })
    if (sub == 0) {
      this.props.onEndRecharge()
    } else {
      this.timerId = setTimeout(this.loop.bind(this), 500)
    }
  }

  componentWillMount() {
    this.state.duration = moment.duration(
      moment(this.props.nextRechargeDate).valueOf() - moment().valueOf()
    )
    this.loop()
  }

  componentWillUnmount() {
    clearTimeout(this.timerId)
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={{ position: 'relative' }}>
          <View style={ styles.atoContainer }>
            <View style={ styles.atoWrapper}>
              <Text style={ styles.ato }>{ 'あと' }</Text>
            </View>
          </View>
          <Text style={ styles.num }>{ `${this.state.duration.minutes()}` }</Text>
        </View>
        <Text style={ styles.minutesText }>{ '分' }</Text>
        <Text style={ styles.num }>{ `${this.state.duration.seconds()}` }</Text>
        <Text style={ styles.secondsText }>{ '秒' }</Text>
      </View>
    )
  }
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  minutesText: {
    color: '#3b3939',
    fontSize: 12,
    marginTop: 24,
    marginRight: 3,
  },
  secondsText: {
    color: '#3b3939',
    fontSize: 12,
    marginTop: 24,
  },
  num: {
    color: '#000',
    backgroundColor: 'transparent',
    fontSize: 36,
    fontFamily: 'Avenir Next',
    width: 45,
    textAlign: 'right',
    marginRight: 5,
  },
  atoContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -36,
    justifyContent: 'center',
  },
  atoWrapper: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
  },
  ato: {
    color: '#b3b3b3',
    fontSize: 10,
    backgroundColor: 'transparent',
  },
})

export default RechargeCountdown
