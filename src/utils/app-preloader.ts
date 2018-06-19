/**
* Class for the Preloader.
* @author Pablo Vieira
* Date: 02/06/2018
* @version 1.0 
*/ 

import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular";

@Injectable()
export class AppPreloader{

    private loading: any;

    constructor(public loadingCtrl: LoadingController){

    }

    showPreloader() : void{
        try{
            this.loading = this.loadingCtrl.create({
            });
            this.loading.present();
        }catch(e){            
            console.error(e);
        }
    }

    hidePreloader() : void{
        try{
            this.loading.dismiss();
        }catch(e){
            console.error(e);
        }
    }
}