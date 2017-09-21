package com.chatnovel;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import io.invertase.firebase.crash.RNFirebaseCrashPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.perf.RNFirebasePerformancePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;

import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;

import com.horcrux.svg.SvgPackage;

import com.cmcewen.blurview.BlurViewPackage;

import com.BV.LinearGradient.LinearGradientPackage;

import cl.json.RNSharePackage;

import com.learnium.RNDeviceInfo.RNDeviceInfo;

import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new SvgPackage(),
          new BlurViewPackage(),
          new LinearGradientPackage(),
          new VectorIconsPackage(),
          new ReactNativeConfigPackage(),
          new RNDeviceInfo(),
          new RNSharePackage(),
          new FabricPackage(),

          // firebase
          new RNFirebasePackage(),
          new RNFirebaseAdMobPackage(),
          new RNFirebaseAnalyticsPackage(),
          new RNFirebaseAuthPackage(),
          new RNFirebaseRemoteConfigPackage(),
          new RNFirebaseCrashPackage(),
          new RNFirebaseDatabasePackage(),
          new RNFirebaseMessagingPackage(),
          new RNFirebasePerformancePackage(),
          new RNFirebaseStoragePackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
