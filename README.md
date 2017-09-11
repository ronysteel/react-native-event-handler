# CHAT NOVEL

## Mission

**ドラゴンボール超えの作品を生み出す！**

## Setup

### 共通

#### Requirement

* node.js v7.10.1
  * npm v4.2.0
* watchman

#### 手順

* nodeをインストール
  * バージョンは `.node-version` を参照する

```
$ brew install node-build nodenv
$ nodenv install
```

* yarnのインストール

```
$ brew install yarn
```

* npmパッケージの更新

```
$ yarn
```

* ReactNative CLIのインストール

```
$ npm install -g react-native-cli
```

### iOS

#### Requirement

* Ruby v2.4.1
* Xcode 8.3.3
  * Swift 3.1
* Cocoapods v1.3.1

#### 手順

* Rubyをインストール
  * バージョンは `.ruby-version` を参照する

```
$ brew install ruby-build rbenv
$ rbenv install
```

* gemパッケージの更新

```
$ cd ./ios
$ bundle install
```

* CocoaPodsでiOSライブラリの更新

```
$ yarn setup:ios
```

#### Run

##### CLI

* top directoryで以下を実行

```
$ yarn run ios
```

##### Xcode

* 通常通りビルド

##### 環境を切り替える

XcodeのEdit Schemaから以下のように選ぶ

![image](https://user-images.githubusercontent.com/76637/30145879-7b0d0828-93cf-11e7-9d89-af3da8a7843c.png)

### Android

#### Requirements
- Java 8 SDK or newer
- Android Studio
- Android SDK
> 前提となる詳細なセットアップ手順は React Native 公式の手順を参照  
> https://facebook.github.io/react-native/docs/getting-started.html  
> Building Projects with Native Code > Target OS > Android

#### Setup


```
yarn install
```

#### Run

```
yarn run android
```
