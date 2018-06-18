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

    //TODO
    getDeviceInformation(){
        try{
            
            return this.deviceReference;
                        
        }catch(e){
            console.error(e);
            this.basicAlert.showBasicAlert(e.message);
        }
    }

    //
    addDeviceInformation(device: Device){
        try{
            
            return this.deviceChildReference.set(device);
                        
        }catch(e){
            console.error(e);
            this.basicAlert.showBasicAlert(e.message);
        }
    }
}