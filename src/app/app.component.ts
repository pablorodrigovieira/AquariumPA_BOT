  import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;
  
  constructor(platform: Platform, 
    statusBar: StatusBar,
    private backgroundMode: BackgroundMode, 
    splashScreen: SplashScreen) {

    platform.ready().then(() => {
      statusBar.overlaysWebView(false);
      //App running in background
      this.backgroundMode.enable();
      statusBar.styleDefault();  
      // set status bar to white
      statusBar.backgroundColorByHexString('#f8f8f8');    
      splashScreen.hide();
    });
  }
}
