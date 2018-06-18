import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Device } from '../models/device';
import { BatteryStatus } from '@ionic-native/battery-status';
import { AquariumListService } from '../services/aquarium-list.service';
import { AppSession } from '../utils/app-session';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  subscription: any;

  device: Device = {
    battery_status: '',
    power_status: ''
  }
  
  constructor(platform: Platform, 
    private batteryStatus: BatteryStatus, 
    statusBar: StatusBar,
    private session: AppSession, 
    private backgroundMode: BackgroundMode, 
    splashScreen: SplashScreen,
    private aquariumService: AquariumListService) {

    platform.ready().then(() => {
      //App running in background
      this.backgroundMode.enable();

      this.checkDeviceInformation();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();      
      splashScreen.hide();
    });
  }

  /**
  * Check device status and Insert DB
  * @author Pablo Vieira
  * Date: 16/06/2018
  * @version 1.0 
  */
  checkDeviceInformation(){
    // watch change in battery status
    this.subscription = this.batteryStatus.onChange().subscribe(status => {
      
      this.session.POWER_STATUS = status;
      this.session.BATTERY_STATUS = status.level;

      this.device.battery_status = String(status.level);
      this.device.power_status = String(status.isPlugged);

      this.aquariumService.addDeviceInformation(this.device);

    });
  }
}
