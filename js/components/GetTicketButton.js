// @flow
import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'

const isDisplay = (ticketCount, remainingTweetCount, isAvailableTwitter) => {
  if (ticketCount > 0) {
    return false
  }
  if (remainingTweetCount == 0) {
    return false
  }

  return isAvailableTwitter
}

type Props = {
  isAvailableTwitter: boolean,
  ticketCount: number,
  remainingTweetCount: number,
  onTapGetTicket: Function,
}

const GetTicketButton = ({
  isAvailableTwitter,
  ticketCount,
  remainingTweetCount,
  onTapGetTicket
}: Props) =>
  !isDisplay(ticketCount, remainingTweetCount, isAvailableTwitter) ? null : (
    <View>
      <TouchableOpacity onPress={onTapGetTicket}>
        <View style={styles.buttonWrapper}>
          <Text style={styles.buttonText}>{'無料で読めるチケットをゲット'}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.note}>{`ツイートして無料でノベルを読めるチケットを\nゲットしよう！`}</Text>
    </View>
  )

const styles: StyleSheet = StyleSheet.create({
  buttonWrapper: {
    width: 290,
    borderRadius: 6,
    backgroundColor: '#ff395d',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonText: {
    padding: 15,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  note: {
    color: '#575757',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    textAlign: 'center'
  }
})

export default GetTicketButton
