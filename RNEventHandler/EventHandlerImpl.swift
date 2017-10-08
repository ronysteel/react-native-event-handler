//
//  EventHandlerImpl.swift
//  RNEventHandler
//
//  Created by koutalou on 2017/09/28.
//  Copyright © 2017年 koutalou. All rights reserved.
//

import UIKit

@objc enum EventType: Int {
    case userDidTakeScreenshot = 1
}

@objc protocol EventHandlerDelegate {
    func event(with eventType: EventType)
}

/* Shard singleton class */
class EventHandlerImpl: NSObject {
    static let shared = EventHandlerImpl()
    weak var delegate: EventHandlerDelegate?
    
    private override init() {
        super.init()
        
        setupObserver()
    }
    
    deinit {
        teardownObserver()
    }

    private func setupObserver() {
        NotificationCenter.default.addObserver(self, selector: #selector(EventHandlerImpl.userDidTakeScreenshot(notification:)), name: .UIApplicationUserDidTakeScreenshot, object: nil)
    }
    
    private func teardownObserver() {
        NotificationCenter.default.removeObserver(self)
    }
    
    @objc func userDidTakeScreenshot(notification: Notification) {
        delegate?.event(with: .userDidTakeScreenshot)
    }
}
