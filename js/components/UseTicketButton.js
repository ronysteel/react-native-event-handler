// @flow
import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import TicketIcon from './TicketIcon'

const UseTicketButton = ({ ticketCount, onTapUseTicket }) => (
  ( ticketCount <= 0 ? null : (
    <View>
      <TouchableOpacity onPress={ onTapUseTicket }>
        <View style={ styles.buttonWrapper }>
          <View style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}>
            <Text style={ styles.buttonText}>
              { 'チケットをつかう' }
            </Text>
          </View>
          <View style={ styles.ticketIconWrapper }>
            <TicketIcon />
            <Text style={ styles.ticketIconText }>{ '1' }</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Text style={ styles.ticketCountText }>
        { `持っているチケット：${ticketCount}枚` }
      </Text>
    </View>
  ) )
)

const styles: StyleSheet = StyleSheet.create({
  buttonWrapper: {
    width: 290,
    borderRadius: 6,
    backgroundColor: '#ff395d',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    padding: 15,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  ticketCountText: {
    color: '#575757',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  ticketIconWrapper: {
    flexDirection: 'row',
    width: 96,
    borderLeftWidth: 1,
    borderColor: '#ff618b',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketIconText: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 8,
  },
})

export default UseTicketButton
