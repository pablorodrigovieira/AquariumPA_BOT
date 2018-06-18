import { Injectable } from "@angular/core";
import { AngularFireDatabase } from 'angularfire2/database';
import { AppSession } from "../utils/app-session";
import { AngularFireAuth } from "angularfire2/auth";
import { AppAlerts } from "../utils/app-alerts";
import { Device } from "../models/device";
import * as firebase from 'firebase';

@Injectable()
export class AquariumListService{

    private deviceReference: any;
    private deviceChildReference: any;
    private database: any;

    constructor(private db: AngularFireDatabase, 
        private basicAlert: AppAlerts, 
        private aFireAuth: AngularFireAuth,
        private session: AppSession){

        this.database = firebase.database();

        //Add references only if User is logged in
        this.aFireAuth.authState.subscribe(data =>{
            if(data && data.email && data.uid){
      
              this.session.USER_ID = data.uid;
              this.session.USER_EMAIL = data.email;

              this.deviceReference = this.database.ref(this.session.USER_ID+'/device/'); 
              this.deviceChildReference = this.db.database.ref(this.session.USER_ID+'/device/');         

            }
        });

    }

    /**
     * Get Device information from Firebase
     * @author Pablo Vieira
     * Date: 18/06/2018
     * @version 1.0 
     */  
    getDeviceInformation(){
        try{            
            return this.deviceReference;                        
        }catch(e){
            console.error(e);
            this.basicAlert.showBasicAlert(e.message);
        }
    }

    /**
     * Add device information into Firebase
     * @author Pablo Vieira
     * Date: 01/06/2018
     * @version 1.0 
     */  
    addDeviceInformation(device: Device){
        try{  
            if(device == undefined)
            {
                device.battery_status = 'Reconnect device';
                device.power_status = 'Reconnect device';                
            }
            
            return this.deviceChildReference.set(device);                                        
        }catch(e){
            console.error(e);
            this.basicAlert.showBasicAlert("error: "+e.message);
        }
    }
}