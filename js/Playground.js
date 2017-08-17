// @flow
import React from 'react'
import { View, StatusBar } from 'react-native'

import Share from 'react-native-share';
import Promotion from './components/Promotion'
import moment from 'moment'

StatusBar.setHidden(false)
StatusBar.setBarStyle('dark-content')

class Playground extends React.PureComponent {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Promotion
          products={{
            products: {
              'co.newn.chatnovel.oneweek': {
                identifier: '',
                currencyCode: '',
                currencySymbol: '',
                description: '',
                downloadable: false,
                price: 900,
                priceString: '¥900',
                title: '1ヶ月',
              },
              'co.newn.chatnovel.onemonth': {
                identifier: '',
                currencyCode: '',
                currencySymbol: '',
                description: '',
                downloadable: false,
                price: 900,
                priceString: '¥900',
                title: '1ヶ月',
              }
            }
          }}
          ticketCount={ 1 }
          remainingTweetCount={ 1 }
          isAvailableTwitter={ false }
          onTapPurchase={ () => {} }
          onTapUseTicket={ () => {} }
          onTapGetTicket={ () => {} }
          onTapRestore={ () => {} }
          nextRechargeDate={ moment().add(30, 'minutes').valueOf() }
          onEndRecharge={ () => {} }
          closeModal={ () => {} }
          onTapPrivacyPolicy={ () => {} }
          onTapTermOfUse={ () => {} }
          onTapHelpPurchase={ () => {} }
        />
      </View>
    )
  }
}
export default Playground
