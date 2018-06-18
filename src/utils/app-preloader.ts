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
                //content: "Loading.."
            });
            this.loading.present();
        }catch(e){
            //TODO
        }
    }

    hidePreloader() : void{
        try{
            this.loading.dismiss();
        }catch(e){

        }
    }
}