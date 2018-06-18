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

  
  async ionViewWillEnter(){
    try{

      //Load once settings from Firebase
      const snapshot = await this.aquariumListService.getDeviceInformation().once('value');
      this.device = snapshot.val();
    
      this.preloader.hidePreloader();  
    
    }catch(e){
      console.error(e);
      this.basicAlert.showBasicAlert(e.message);
    }      
  }
  
  
  async loadDeviceInfo(){
    try{
      //Load if settings changed from Firebase
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
      //Wait 3 seconds to load the Images from Storage
      setTimeout(() => this.preloader.hidePreloader(), 3000);
      
      this.platform.ready().then( async () =>{
         await this.loadDeviceInfo();
      });

    }catch(e){
      console.error(e);
      this.basicAlert.showBasicAlert(e.message);
    }      
  }

  

  ionViewWillLoad(){
    try{
      this.preloader.showPreloader();        
    }catch(e){
      console.error(e);
      this.basicAlert.showBasicAlert(e.message);
    }
  }

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
