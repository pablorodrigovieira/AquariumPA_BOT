import { Component, EventEmitter } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AquariumListService } from '../../services/aquarium-list.service';
import { AppAlerts } from '../../utils/app-alerts';
import { AppPreloader } from '../../utils/app-preloader';
import { LoginPage } from '../login/login';
import { Device } from '../../models/device';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  device = {} as Device;
  deviceChanges = new EventEmitter<string>();
  
  constructor(public navCtrl: NavController, 
    private afAuth: AngularFireAuth,
    private aquariumListService: AquariumListService,
    public platform: Platform,
    private basicAlert: AppAlerts,
    private preloader: AppPreloader) {

  }

  /**
  * Load once settings from Firebase
  * @author Pablo Vieira
  * Date: 01/06/2018
  * @version 1.0 
  */
  async ionViewWillEnter(){
    try{
      const snapshot = await this.aquariumListService.getDeviceInformation().once('value');
      this.device = snapshot.val();
    }catch(e){
      console.error(e);
      this.basicAlert.showBasicAlert(e.message);
    }      
  }
  
  /**
  * Load if settings changed from Firebase
  * @author Pablo Vieira
  * Date: 01/06/2018
  * @version 1.0 
  */
  async loadDeviceInfo(){
    try{
      await this.aquariumListService.getDeviceInformation().on('value', (snapshot) => {
        this.deviceChanges.emit(snapshot.val());
      });

      //Update Device
      this.deviceChanges.subscribe(
          (snap) => {
              this.device = snap;
          (err) => {
              console.log(err);
              this.basicAlert.showBasicAlert(err);
        }});
    }catch(e){
      console.error(e);
      this.basicAlert.showBasicAlert(e.message);
    }  
  }

  ionViewDidLoad(){
    try{
      this.platform.ready().then( async () =>{
         await this.loadDeviceInfo();
         this.preloader.hidePreloader();
      });
    }catch(e){
      console.error(e);
      this.preloader.hidePreloader();
      this.basicAlert.showBasicAlert(e.message);
    }      
  }

  ionViewWillLoad(){
    try{
      this.preloader.showPreloader();        
    }catch(e){
      console.error(e);
      this.preloader.hidePreloader();
      this.basicAlert.showBasicAlert(e.message);
    }
  }

  /**
  * Logout method
  * @author Pablo Vieira
  * Date: 01/06/2018
  * @version 1.0 
  */  
   logout(){
    try{   
      this.afAuth.auth.signOut().then(() => {
        this.navCtrl.parent.parent.setRoot(LoginPage);         
      });
    }catch(e){
      console.error(e);
      this.basicAlert.showBasicAlert(e.message);
    }
  }
}
