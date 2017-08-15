// @flow
import React from 'react'
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native'

import RechargeCountdown from './RechargeCountdown'
import UseTicketButton from './UseTicketButton'
import GetTicketButton from './GetTicketButton'
import CloseIcon from './CloseIcon'
import {
  PurchaseButtonOneMonth,
  PurchaseButtonOneWeek,
} from './PurchaseButton'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0

const PRODUCT_ID_ONE_MONTH = `co.newn.chatnovel.onemonth`
const PRODUCT_ID_ONE_WEEK = `co.newn.chatnovel.oneweek`

const Separator = () => (
  <View style={ styles.sectionTitleWrapper }>
    <View style={ styles.sectionTitleBorder } />
    <View style={ styles.sectionTitleTextWrapper }>
      <Text style={ styles.sectionTitle }>{ 'OR' }</Text>
    </View>
  </View>
)

const Promotion = ({
  products,
  nextRechargeDate,
  closeModal,
  ticketCount,
  remainingTweetCount,
  isAvailableTwitter,
  onTapPurchase,
  onTapUseTicket,
  onTapGetTicket,
  onTapRestore,
  onEndRecharge,
}) => {
  return (
    <ScrollView style={ styles.container }>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={ closeModal }>
          <View style={ styles.close }>
            <CloseIcon color={ "#000" } />
          </View>
        </TouchableOpacity>
      </View>
      <View style={ styles.countTextWrapper }>
        <Text style={ styles.countText }>{ '続きが読めるまで…' }</Text>
      </View>
      <RechargeCountdown
        onEndRecharge={ onEndRecharge }
        nextRechargeDate={ nextRechargeDate }
      />

      <Separator />

      <View>
        <Text style={ styles.promotionTitle }>
          { "まずは7日間無料\nすべてのノベルが読み放題！" }
        </Text>
        <View style={ styles.promotionButtons }>
          <PurchaseButtonOneWeek
            product={ products.products[PRODUCT_ID_ONE_WEEK] }
            onTapPurchase={ onTapPurchase }
          />
          <PurchaseButtonOneMonth
            product={ products.products[PRODUCT_ID_ONE_MONTH] }
            onTapPurchase={ onTapPurchase }
          />
          <GetTicketButton
            ticketCount={ ticketCount }
            remainingTweetCount={ remainingTweetCount }
            isAvailableTwitter={ isAvailableTwitter }
            onTapGetTicket={ onTapGetTicket }
          />
          <UseTicketButton
            ticketCount={ ticketCount }
            onTapUseTicket={ onTapUseTicket }
          />
        </View>
      </View>

      <View style={ styles.restoreWrapper }>
        <TouchableOpacity onPress={ onTapRestore }>
          <Text style={ styles.restoreText }>{ 'メンバーのかたはこちら' }</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles: StyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: STATUSBAR_HEIGHT,
  },

  close: {
    padding: 15,
  },

  // counter

  countTextWrapper: {
    marginTop: 12,
    marginBottom: 10,
  },
  countText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B3939',
    textAlign: 'center',
  },

  // section title

  sectionTitleWrapper: {
    position: 'relative',
    paddingHorizontal: 15,
    marginBottom: 30,
    marginTop: 30,
    height: 17,
  },
  sectionTitleBorder: {
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  sectionTitleTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  sectionTitle: {
    color: '#d1d1d1',
    backgroundColor: '#fff',
    marginTop: (-14 / 2) - 2,
    paddingHorizontal: 10,
    fontSize: 14,
    textAlign: 'center',
  },

  // promotion

  promotionTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 30,
  },
  promotionButtons: {
    alignSelf: 'center',
  },

  // restore purchase

  restoreWrapper: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  restoreText: {
    color: '#ff1b60',
    fontSize: 12,
    textAlign: 'center',
    padding: 15,
  },
})

export default Promotion
