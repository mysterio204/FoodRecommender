import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Einkaufsliste page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
  	selector: 'page-einkaufsliste',
  	templateUrl: 'einkaufsliste.html'
  })
  export class EinkaufslistePage {

  	vorraetePage: any;

  	newGrocery:any;
  	newAmount:any;

  	item:any;
  	item2:any;
  	item3:any;

  	newItem:any;
  	currentId:any;
  	itemlist:Array<any>
	unitlist: string[] = ["mg", "g", "kg", "l", "liter","Stangen"];
  	grocerylist: string[] = [];
  	supplylist:Array<any>;

  	//Test data
  	neededGroceries:Array<any>;
  	missingGroceries:Array<any>;

  	constructor(public navCtrl: NavController) {
  		this.fetchSupplies();
  		this.fetchGroceries();

  		this.compareSupplyGroceries();
  	}

  	fetchSupplies(){
  		//Fetch the available supplies
	  	this.supplylist = [];
	  	this.item={name:"Rhabarber",menge:"3 Stangen",wertung:"5", id:"15"};
	  	this.supplylist.push(this.item);
	  	this.item={name:"Kandiszucker",menge:"250 g",wertung:"2", id:"23"};
	  	this.supplylist.push(this.item);
	  	this.item={name:"Kürbis",menge:"1",wertung:"4", id:"124"};
	  	this.supplylist.push(this.item);
  	}

  	fetchGroceries(){
  		//Fetch the needed groceries
  		this.neededGroceries = [];
	  	this.item={name:"Rhabarber",menge:"1 Stangen",wertung:"5", id:"15"};
	  	this.neededGroceries.push(this.item);
	  	this.item={name:"Kandiszucker",menge:"350 g",wertung:"2", id:"23"};
	  	this.neededGroceries.push(this.item);
	  	this.item={name:"Kürbis",menge:"2",wertung:"4", id:"124"};
	  	this.neededGroceries.push(this.item);
	  	this.item={name:"Tee",menge:"1 Päckchen",wertung:"2", id:"24"};
	  	this.neededGroceries.push(this.item);
	  	this.item={name:"Vanillezucker",menge:"2 Packungen",wertung:"4", id:"125"};
	  	this.neededGroceries.push(this.item);
  	}

  	ionViewDidLoad() {
  		console.log('Hello EinkaufslistePage Page');
  	}

  	addGrocery(){
  	//Save the added grocery
  	this.newItem={name:this.newGrocery, menge:this.newAmount, wertung:"3", id:"12"};
  	this.itemlist.push(this.newItem);
  	//this.storage.set('supplies', JSON.stringify(this.itemlist)).then(this.fetchSupplies2());
  }

  increaseGrocery(id){
  	//Increase the amount of the chosen grocery
  	this.currentId = id;
  	var amount = this.getAmountById(id);
  	var unit = this.separateUnit(amount);
  	amount = this.separateAmount(amount);
  	amount = this.increaseAmount(amount);
  	this.saveNewAmountById(amount+" "+unit, id);
  }

  reduceGrocery(id){
  	//Reduce the amount of the chosen grocery
  	this.currentId = id;
  	var amount = this.getAmountById(id);
  	var unit = this.separateUnit(amount);
  	amount = this.separateAmount(amount);
  	amount = this.reduceAmount(amount);
  	this.saveNewAmountById(amount+" "+unit, id);
  }

  deleteGrocery(id){
  	//Delete the amount of the chosen grocery
  	for (var i = this.itemlist.length - 1; i >= 0; i--) {
  		if(this.itemlist[i].id == id){
  			this.itemlist.splice(i, 1);
  		}
  	}
  }

  increaseAmount(amount){
  	//Increase the given amount
  	var groceryAmount = +amount;
  	if(groceryAmount > 1000){
  		groceryAmount += 500;
  	}else if(groceryAmount > 100){
  		groceryAmount += 50;
  	}else if(groceryAmount > 30){
  		groceryAmount += 20;
  	}else if(groceryAmount >= 1){
  		groceryAmount += 1;
  	}else if(groceryAmount > 0.2){
  		groceryAmount += 0.1;
  	}else if(groceryAmount >= 0.02){
  		groceryAmount += 0.01;
  	}

  	groceryAmount = Number((groceryAmount).toFixed(2));

  	return groceryAmount;
  }

  reduceAmount(amount){
  	//Increase the given amount
  	var groceryAmount = +amount;
  	if(groceryAmount > 1000){
  		groceryAmount -= 500;
  	}else if(groceryAmount > 100){
  		groceryAmount -= 50;
  	}else if(groceryAmount > 30){
  		groceryAmount -= 20;
  	}else if(groceryAmount > 1){
  		groceryAmount -= 1;
  	}else if(groceryAmount > 0.2){
  		groceryAmount -= 0.1;
  	}else if(groceryAmount > 0.02){
  		groceryAmount -= 0.01;
  	}

  	if(groceryAmount < 0){
  		groceryAmount = 0;
  	}

  	groceryAmount = Number((groceryAmount).toFixed(2));

  	return groceryAmount;
  }

  separateAmount(amount){
  	//Separate the amount value from the amount string
  	var grocerylist;
  	grocerylist = amount.split(" ");
  	return grocerylist[0];
  }

  separateUnit(amount){
  	//Separate the unit from the amount string
  	this.grocerylist = amount.split(" ");
  	if(this.grocerylist[1] != undefined){
  		return this.grocerylist[1];
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

  compareSupplyGroceries(){
  	//Compare the available supplies and needed groceries
  	//Return a list containing the missing groceries
  	this.missingGroceries = [];
  	let missingGrocery;
  	let subtractedAmount;

  	//Iterate through the needed groceries and the available supplies to find 
  	//matching ids and check whether the given amount is bigger than the needed amount
  	//If the needed amount is bigger calculate the missing amount and save it in the
  	//missingGroceries list
  	for (var i = this.neededGroceries.length - 1; i >= 0; i--) {
  		for (var j = this.supplylist.length - 1; j >= 0; j--) {

  			var id1 = +this.supplylist[j].id;
  			var id2 = +this.neededGroceries[i].id;
  			console.log("Vergleich: ");
  			console.log(this.supplylist[j]);
  			console.log(this.neededGroceries[i]);
  			if(id1 === id2){

  				subtractedAmount = this.subtractTwoAmounts(this.neededGroceries[i].menge, this.supplylist[j].menge);
  				if(this.separateAmount(subtractedAmount) > 0){

  					missingGrocery = this.neededGroceries[j];
  					missingGrocery.menge = subtractedAmount;
  					this.missingGroceries.push(missingGrocery);
  				}
  				//Break the current loop
  				j = -1;
  			}
  		}
  	}
  	this.itemlist = this.missingGroceries;
  	console.log(this.itemlist);
  }

  subtractTwoAmounts(amount1, amount2){
  	var amount, unit;
  	
  	unit = this.separateUnit(amount1);
  	amount = this.separateAmount(amount1) - this.separateAmount(amount2);

  	return amount + " " + unit;
  }


}
