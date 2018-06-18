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

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  user = {} as User;
  subscription: any;

  device: Device = {
    battery_status: '',
    power_status: ''
  }

  //Form Validation
  hasError = "";
  submitForm: boolean = false;
  formGroup: FormGroup;
  email: AbstractControl;
  password: AbstractControl;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private aFireAuth: AngularFireAuth,
    private basicAlert: AppAlerts,   
    private session: AppSession,
    private preloader: AppPreloader,
    private batteryStatus: BatteryStatus,
    public formBuilder: FormBuilder,
    private aquariumService: AquariumListService) {

    //Form Validation
    this.formGroup = formBuilder.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });

    this.email = this.formGroup.controls['email'];
    this.password = this.formGroup.controls['password'];

    //this.checkDeviceInformation();

  }

  /**
  * Perform sign up
  * @author Pablo Vieira
  * Date: 01/06/2018
  * @version 1.0 
  */
  async PerformSignup(user: User){
    try{
      this.submitForm = true;

      this.preloader.showPreloader();

      //If form Valid, Insert into DB
      if(this.formGroup.valid){        
        if(user != null){        
          const result = await this.aFireAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
          
          if(result){          
            this.AddUserToSession().then(()=>{ 
                this.aquariumService.addDeviceInformation(this.device);
                this.preloader.hidePreloader();
                this.navCtrl.setRoot(TabsPage);
            });
          } 
        }
      }
      else{
        this.basicAlert.showBasicAlert("Please fill the information.");
        this.preloader.hidePreloader();
      }
    }
    catch(e){
      console.error(e);
      this.preloader.hidePreloader();
      this.basicAlert.showBasicAlert(e.message);
    }
  }
  
  /**
  * Add User to Session
  * @author Pablo Vieira
  * Date: 01/06/2018
  * @version 1.0 
  */
  async AddUserToSession(){
    try{
      //Save UID in session
      await this.aFireAuth.authState.subscribe(data =>{
        if(data && data.email && data.uid){

          this.session.USER_ID = data.uid;
          this.session.USER_EMAIL = data.email;
        }
      }); 
    }
    catch(e){
      console.error(e);
      this.preloader.hidePreloader();
      this.basicAlert.showBasicAlert(e.message);
    }
              
  }

  /**
  * Perform login
  * @author Pablo Vieira
  * Date: 01/06/2018
  * @version 1.0 
  */
  async PerformLogin(user: User){
    try{
      this.submitForm = true;

      this.preloader.showPreloader();

      //If form Valid, Insert into DB
      if(this.formGroup.valid){
        if(user != null){
          this.checkDeviceInformation();
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
      else{
        this.basicAlert.showBasicAlert("Please fill the information.");
        this.preloader.hidePreloader();
      }
    }
    catch(e){      
      console.error(e);     
      this.preloader.hidePreloader();
      this.basicAlert.showBasicAlert(e.message);
    }
  }

  /**
  * Check device status and Insert DB
  * @author Pablo Vieira
  * Date: 16/06/2018
  * @version 1.0 
  */
  checkDeviceInformation(){
    try{
      // watch change in battery status
      this.subscription = this.batteryStatus.onChange().subscribe(status => {

        if(status){
          this.device.battery_status = String(status.level);
          this.device.power_status = String(status.isPlugged);
        }
        else{
          this.device.battery_status = 'Reconnect device';
          this.device.power_status = 'Reconnect device'
        }
        this.aquariumService.addDeviceInformation(this.device);
      });
    }
    catch(e){
      console.error(e);
      this.preloader.hidePreloader();
      this.basicAlert.showBasicAlert(e.message);
    }    
  }
}
