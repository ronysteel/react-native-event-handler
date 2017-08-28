// @flow
import React from 'react'
import { connect } from 'react-redux'
import { Text, ScrollView, WebView, StyleSheet } from 'react-native'

const PRODUCT_ID_ONE_MONTH = `co.newn.chatnovel.onemonth`
const PRODUCT_ID_ONE_WEEK = `co.newn.chatnovel.oneweek`

const title = `CHAT NOVEL定期購読会員`
const body = (products) => (`
・CAHT NOVELは基本利用は無料のアプリですが、定期購読をすることによりすべてのノベルを時間制限なく読めるようになります
・CHAT NOVELには1週間と1ヶ月の定期購読プランがあります
・1週間プランは1週間に${products[PRODUCT_ID_ONE_WEEK].priceString}の料金がかかります(最初の1週間はトライアル期間となり無料になります)
・1ヶ月プランは1ヶ月に${products[PRODUCT_ID_ONE_MONTH].priceString}の料金がかかります
・お支払はiTunesアカウントに請求されます
・定期購読の期間終了日の24時間前までに自動更新を解除しない場合、自動的に購読が継続されます。その後、購読期間の終了後24時間以内に課金が行われます
・定期購読の解約は「設定」アプリの「iTunesとApp store」から行えます。CHAT NOVELアプリ内からの解約は行えません。
`)

class AboutSubscriptionContainer extends React.PureComponent {
  render() {
    if (!this.props.purchasingProducts.isLoaded) {
      return null
    }

    return (
      <ScrollView style={ styles.container }>
        <Text style={ styles.title }>{ title }</Text>
        <Text style={ styles.body }>{ body(this.props.purchasingProducts.products) }</Text>
      </ScrollView>
    )
  }
}
AboutSubscriptionContainer.navigationOptions = () => ({
  title: '定期購読について',
  headerTintColor: '#000',
})

const styles: StyleSheet = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  body: {
    fontSize: 13,
    lineHeight: 17,
    color: '#000',
  },
})

const select = (store, props) => {
  return {
    purchasingProducts: store.purchasingProducts,
  }
}

export default connect(select)(AboutSubscriptionContainer)