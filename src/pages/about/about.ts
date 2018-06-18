import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { AppAlerts } from '../../utils/app-alerts';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  constructor(public navCtrl: NavController, 
    private basicAlert: AppAlerts, 
    private afAuth: AngularFireAuth) {


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
