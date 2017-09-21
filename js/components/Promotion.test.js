import React from 'react'
import renderer from 'react-test-renderer'
import moment from 'moment'

import Promotion from './Promotion'

describe('renders without crashing', () => {
  it('', () => {
    jest.useFakeTimers()

    let Component = (
      <Promotion
        ticketCount={1}
        remainingTweetCount={1}
        isAvailableTwitter={false}
        onTapPurchase={() => {}}
        onTapUseTicket={() => {}}
        onTapGetTicket={() => {}}
        onTapRestore={() => {}}
        nextRechargeDate={moment()
          .add(30, 'minutes')
          .valueOf()}
        onEndRecharge={() => {}}
        closeModal={() => {}}
        onTapPrivacyPolicy={() => {}}
        onTapTermOfUse={() => {}}
        onTapHelpPurchase={() => {}}
      />
    )
    const rendered = renderer.create(Component).toJSON()
    expect(rendered).toBeTruthy()
    jest.clearAllTimers()
  })
})
