import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class AppAlerts{

    //String Messages


    constructor(public alertCtrl: AlertController){

    }

    public showBasicAlert(message: string){
        
      const alert = this.alertCtrl.create({
        title: 'Attention',
        subTitle: message,
        buttons: ['OK']
      });
      alert.present();
    
    }

}