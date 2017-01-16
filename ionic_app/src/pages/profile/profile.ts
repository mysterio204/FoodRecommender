import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  nutrition : any;
  allergies : any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {
    this.nutrition = 0;
    this.allergies = [];

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  skip(){
    console.log(this.nutrition);
    console.log(this.allergies);

  }

}

