// @flow
import React from 'react'
import { View, StatusBar } from 'react-native'

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
              'test.skahack.001': {
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
          onTapPurchase={ () => {} }
          onTapUseTicket={ () => {} }
          nextRechargeDate={ moment().add(30, 'minutes').valueOf() }
          onEndRecharge={ () => {} }
          closeModal={ () => {} }
        />
      </View>
    )
  }
}
export default Playground
