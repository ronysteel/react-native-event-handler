// @flow
import React from 'react'
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native'

import RechargeCountdown from './RechargeCountdown'
import UseTicketButton from './UseTicketButton'
import CloseIcon from './CloseIcon'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0

const Separator = () => (
  <View style={ styles.sectionTitleWrapper }>
    <View style={ styles.sectionTitleBorder } />
    <View style={ styles.sectionTitleTextWrapper }>
      <Text style={ styles.sectionTitle }>{ 'OR' }</Text>
    </View>
  </View>
)

// TODO
const PRODUCT_ID_ONE_MONTH = `test.skahack.001`

const PurchaseButtonOneMonth = ({ product, onTapPurchase }) => (
  <TouchableOpacity onPress={ onTapPurchase }>
    <View style={ styles.promotionButton }>
      <Text style={ styles.promotionButtonText }>{ product.priceString }</Text>
      <Text style={ styles.promotionButtonTitleText }>{ `/ ${product.title}` }</Text>
    </View>
  </TouchableOpacity>
)

const Promotion = ({
  products,
  nextRechargeDate,
  closeModal,
  ticketCount,
  onTapPurchase,
  onTapUseTicket,
  onEndRecharge,
}) => {
  return (
    <View style={ styles.container }>
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
          <PurchaseButtonOneMonth
            product={ products.products[PRODUCT_ID_ONE_MONTH] }
            onTapPurchase={ onTapPurchase }
          />
          <UseTicketButton
            ticketCount={ ticketCount }
            onTapUseTicket={ onTapUseTicket }
          />
        </View>
      </View>
    </View>
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
  promotionButton: {
    width: 290,
    padding: 15,
    borderRadius: 6,
    backgroundColor: '#ff395d',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  promotionButtonText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 18,
  },
  promotionButtonTitleText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 9,
  },
})

export default Promotion
