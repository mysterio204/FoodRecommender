import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import {SettingsPage} from '../settings/settings';
import { NativeStorage } from 'ionic-native';
/*
  Generated class for the Vorraete page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-vorraete',
  templateUrl: 'vorraete.html'
})
export class VorraetePage {

  neuerVorrat:any;
    neueMenge:any;
    supplies:any;
    item:any;
    item2:any;
    item3:any;
    newItem:any;
    currentId:any;
    itemlist:Array<any>;
    unitlist: string[] = ["mg", "g", "kg", "l", "liter","Stangen"];
    supplylist: string[] = [];
    unit:any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    this.fetchSupplies();
  }

  fetchSupplies(){
    //Fetch the saved supplies
    NativeStorage.getItem('supply')
    .then(
      data => this.itemlist = data,
      error => console.error(error)
    );

    if(this.itemlist == undefined){
      this.itemlist = [];
    }
  }

  ionViewDidLoad() {
    console.log("itemlist: "+this.itemlist);
  }

  addVorrat(){
    //Save the added supply
    this.newItem={name:this.neuerVorrat, menge:this.neueMenge, wertung:"3", id:this.getNewId()};
    this.itemlist.push(this.newItem);

    this.updateSupplyStorage();
  }

  updateSupplyStorage(){
  //Update the locally saved supplies
    NativeStorage.setItem('supply', this.itemlist)
    .then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );
  }

  //Return the list containing the supply
  getSupplyList(){
    return this.itemlist;
  }

  getNewId(){
    let id = (Math.floor(Math.random() * 1000) + 1); 
    console.log(id);
    return id;
  }

  increaseSupply(id){
    //Increase the amount of the chosen supply
    this.currentId = id;
    let amount = this.getAmountById(id);
    let unit = this.separateUnit(amount);
    amount = this.separateAmount(amount);
    amount = this.increaseAmount(amount);
    this.saveNewAmountById(amount+" "+unit, id);
    this.updateSupplyStorage();
  }

  reduceSupply(id){
    //Reduce the amount of the chosen supply
    this.currentId = id;
    let amount = this.getAmountById(id);
    let unit = this.separateUnit(amount);
    amount = this.separateAmount(amount);
    amount = this.reduceAmount(amount);
    this.saveNewAmountById(amount+" "+unit, id);
    this.updateSupplyStorage();
  }

  deleteSupply(id){
    //Delete the amount of the chosen supply
    for (let i = this.itemlist.length - 1; i >= 0; i--) {
      if(this.itemlist[i].id == id){
        this.itemlist.splice(i, 1);
      }
    }
    this.updateSupplyStorage();
  }

  increaseAmount(amount){
    //Increase the given amount
    let supplyAmount = +amount;
    if(supplyAmount > 1000){
      supplyAmount += 500;
    }else if(supplyAmount > 100){
      supplyAmount += 50;
    }else if(supplyAmount > 30){
      supplyAmount += 20;
    }else if(supplyAmount >= 1){
      supplyAmount += 1;
    }else if(supplyAmount > 0.2){
      supplyAmount += 0.1;
    }else if(supplyAmount > 0.02){
      supplyAmount += 0.01;
    }

    supplyAmount = Number((supplyAmount).toFixed(2));

    return supplyAmount;
  }

  reduceAmount(amount){
    //Reduce the given amount
    let supplyAmount = +amount;
    if(supplyAmount > 1000){
      supplyAmount -= 500;
    }else if(supplyAmount > 100){
      supplyAmount -= 50;
    }else if(supplyAmount > 30){
      supplyAmount -= 20;
    }else if(supplyAmount > 1){
      supplyAmount -= 1;
    }else if(supplyAmount > 0.2){
      supplyAmount -= 0.1;
    }else if(supplyAmount > 0.02){
      supplyAmount -= 0.01;
    }

    if(supplyAmount < 0){
      supplyAmount = 0;
    }

    supplyAmount = Number((supplyAmount).toFixed(2));

    return supplyAmount;
  }

  separateAmount(amount){
    //Separate the amount value from the amount string
    let supplylist;
    supplylist = amount.split(" ");
    return supplylist[0];
  }

  separateUnit(amount){
    //Separate the unit from the amount string
    this.supplylist = amount.split(" ");
    if(this.supplylist[1] != undefined){
      return this.supplylist[1];
    }else{
      return "";
    }
  }

  saveNewAmountById(newAmount, id){
    //Save the new amount
    for (let i = this.itemlist.length - 1; i >= 0; i--) {
      if(this.itemlist[i].id == id){
        this.itemlist[i].menge = newAmount;
        return;
      }
    }
  }

  getAmountById(id){
    //Return the amount of the given supply 
    for (let i = this.itemlist.length - 1; i >= 0; i--) {
      if(this.itemlist[i].id == id){
        return this.itemlist[i].menge;
      }
    }
  }


  toSettings(){
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present();
  }

}
