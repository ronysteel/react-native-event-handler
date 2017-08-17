// @flow
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import RecommendRibbon from './RecommendRibbon'

export const PurchaseButtonOneMonth = ({ product, onTapPurchase }) => (
  <TouchableOpacity onPress={ onTapPurchase.bind(null, product.identifier) }>
    <View style={ styles.promotionButton }>
      <Text style={ styles.promotionButtonText }>{ product.priceString }</Text>
      <Text style={ styles.promotionButtonTitleText }>{ `/ 1か月` }</Text>
    </View>
  </TouchableOpacity>
)

export const PurchaseButtonOneWeek = ({ product, onTapPurchase }) => (
  <TouchableOpacity onPress={ onTapPurchase.bind(null, product.identifier) }>
    <View style={ styles.weekWrapper }>
      <Text style={ styles.weekFreeText }>{ '7日間無料' }</Text>
      <Text style={ styles.weekPriceText }>
        { `その後 ${product.priceString} / 1週間` }
      </Text>
      <View style={ styles.ribbon }>
        <RecommendRibbon />
        <Text style={ styles.ribbonText }>{ 'おすすめ' }</Text>
      </View>
    </View>
  </TouchableOpacity>
)

const styles: StyleSheet = StyleSheet.create({
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
    fontWeight: '600',
    lineHeight: 21,
  },
  promotionButtonTitleText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 14,
    marginLeft: 9,
    paddingBottom: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
  },

  weekWrapper: {
    width: 290,
    padding: 9,
    borderRadius: 6,
    backgroundColor: '#ff395d',
    justifyContent: 'center',
    marginBottom: 15,
  },
  weekFreeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  weekPriceWrapper: {
    flexDirection: 'row',
  },
  weekPriceText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  ribbon: {
    position: 'absolute',
    top: 8,
    left: -3,
  },
  ribbonText: {
    position: 'absolute',
    top: 8,
    left: 7,
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
})
