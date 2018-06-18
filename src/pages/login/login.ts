import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { User } from '../../models/user';

import { AngularFireAuth } from 'angularfire2/auth';
import { AppPreloader } from '../../utils/app-preloader';
import { AppAlerts } from '../../utils/app-alerts';
import { AppSession } from '../../utils/app-session';
import { AquariumListService } from '../../services/aquarium-list.service';
import { BatteryStatus } from '@ionic-native/battery-status';
import { Device } from '../../models/device';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  //COMMENTS

  user = {} as User;
  subscription: any;

  device: Device = {
    battery_status: '',
    power_status: ''
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private aFireAuth: AngularFireAuth,
    private basicAlert: AppAlerts,   
    private session: AppSession,
    private preloader: AppPreloader,
    private batteryStatus: BatteryStatus,
    private aquariumService: AquariumListService) {
        
    this.user.email = "pablovieira.com@gmail.com";
    this.user.password = "123456";

    this.checkDeviceInformation();
  }

  /**
  * Perform sign up
  * @author Pablo Vieira
  * Date: 01/06/2018
  * @version 1.0 
  */
  async PerformSignup(user: User){
    try{
      if(user != null){        
        this.preloader.showPreloader();
        const result = await this.aFireAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
        
        if(result){          
           this.AddUserToSession().then(()=>{
              this.preloader.hidePreloader();
              this.navCtrl.setRoot(TabsPage);
           });
        } 
      }
    }
    catch(e){
      console.error(e);
      this.preloader.hidePreloader();
      this.basicAlert.showBasicAlert(e.message);
    }
  }
  
  async AddUserToSession(){
    //Save UID in session
    await this.aFireAuth.authState.subscribe(data =>{
      if(data && data.email && data.uid){

        this.session.USER_ID = data.uid;
        this.session.USER_EMAIL = data.email;
      }
    });       
    
  }
  /**
  * Perform login
  * @author Pablo Vieira
  * Date: 01/06/2018
  * @version 1.0 
  */
  async PerformLogin(user: User){
    try{
      if(user != null){
        this.checkDeviceInformation();
        this.preloader.showPreloader();
        const result = await this.aFireAuth.auth.signInWithEmailAndPassword(user.email, user.password);

        if(result){
          //Save UID in session
          this.aFireAuth.authState.subscribe(data =>{
            if(data && data.email && data.uid){

              this.session.USER_ID = data.uid;
            }
          });  
          
          this.preloader.hidePreloader();
          this.navCtrl.setRoot(TabsPage);
        }
      }
    }
    catch(e){      
      console.error(e);     
      this.preloader.hidePreloader();
      this.basicAlert.showBasicAlert(e.message);
    }
  }

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
