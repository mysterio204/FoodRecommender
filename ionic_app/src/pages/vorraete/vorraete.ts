import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
//import { Storage} from '@ionic/storage';


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

  	

  	constructor(public navCtrl: NavController/*, public storage:Storage*/) {
  		this.fetchSupplies();
  		//this.fetchSupplies2();

  	}


/*
  	fetchSupplies2(){

  		this.storage.get('supplies').then(function(data){
  			if (data != null){
  				this.supplies = JSON.parse(data);
  				console.log("data: "+data);
  				console.log("JSONdata: "+JSON.parse(data));
  			}else{
  				this.loadDefaultQuestions();
  			}
  		});
  		console.log("supplies: "+this.supplies);
  	}*/

  	fetchSupplies(){
  	//Fetch the saved supplies
  	this.itemlist = [];
  	this.item={name:"Rhabarber",menge:"3 Stangen",wertung:"5", id:"15"};
  	this.item2={name:"Kandiszucker",menge:"250 g",wertung:"2", id:"23"};
  	this.item3={name:"Kürbis",menge:"1",wertung:"4", id:"124"};
  	this.itemlist.push(this.item);
  	this.itemlist.push(this.item2);
  	this.itemlist.push(this.item3);
  }

  ionViewDidLoad() {
  	console.log("itemlist: "+this.itemlist);
  }

  addVorrat(){
  	//Save the added supply
  	this.newItem={name:this.neuerVorrat, menge:this.neueMenge, wertung:"3", id:"12"};
  	this.itemlist.push(this.newItem);
  	//this.storage.set('supplies', JSON.stringify(this.itemlist)).then(this.fetchSupplies2());
  }

  increaseSupply(id){
  	//Increase the amount of the chosen supply
  	this.currentId = id;
  	var amount = this.getAmountById(id);
  	var unit = this.separateUnit(amount);
  	amount = this.separateAmount(amount);
  	amount = this.increaseAmount(amount);
  	this.saveNewAmountById(amount+" "+unit, id);
  }

  reduceSupply(id){
  	//Reduce the amount of the chosen supply
  	this.currentId = id;
  	var amount = this.getAmountById(id);
  	var unit = this.separateUnit(amount);
  	amount = this.separateAmount(amount);
  	amount = this.reduceAmount(amount);
  	this.saveNewAmountById(amount+" "+unit, id);
  }

  deleteSupply(id){
  	//Delete the amount of the chosen supply
  	for (var i = this.itemlist.length - 1; i >= 0; i--) {
  		if(this.itemlist[i].id == id){
  			this.itemlist.splice(i, 1);
  		}
  	}
  }

  increaseAmount(amount){
  	//Increase the given amount
  	var supplyAmount = +amount;
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
  	//Increase the given amount
  	var supplyAmount = +amount;
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
  	var supplylist;
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
  	for (var i = this.itemlist.length - 1; i >= 0; i--) {
  		if(this.itemlist[i].id == id){
  			this.itemlist[i].menge = newAmount;
  			return;
  		}
  	}
  }

  getAmountById(id){
  	//Return the amount of the given supply 
  	for (var i = this.itemlist.length - 1; i >= 0; i--) {
  		if(this.itemlist[i].id == id){
  			return this.itemlist[i].menge;
  		}
  	}
  }

}
