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

* 指定のnodeをInstall, Defaultに指定

```
$ nvm install 7.10.1
$ nvm use 7.10.1
$ nvm alias default 7.10.1
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

rvmを使った手順なので、rbenvを使う場合は同様の対応が必要です

* 指定のRubyをInstall, Defaultに指定

```
$ rvm install 2.4.1
$ rvm use 2.4.1
$ rvm default 2.4.1
```

* gemパッケージの更新

```
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

* WIP
