import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import {SettingsPage} from '../settings/settings';
import { NativeStorage } from 'ionic-native';

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

  title1:String;
  title2:String;

  recipe:any;
  ingredients:any;

  newItem:any;
  currentId:any;
  itemlist:Array<any>;
  ingredientsList:Array<any>;

  unitlist: string[] = ["mg", "g", "kg", "l", "liter","Stangen"];
  grocerylist: string[] = [];
  supplylist:Array<any>;

  neededGroceries:Array<any>;
  missingGroceries:Array<any>;

  constructor(public navCtrl: NavController,  public modalCtrl: ModalController, public navParams:NavParams) {}

  //Load the currently selected recipe from the local storage
  calculateList(){
    NativeStorage.getItem('activeRecipe')
      .then(
      data => this.saveRecipe(data),
      error => console.error(error)
    );
  }

  //Save the recipe in a variable and start fetching the available supllies
  saveRecipe(data){
    this.recipe = data;
    this.ingredients = [];

    this.fetchSupplies();
  }

  //Fetch the available supplies from the local storage
  fetchSupplies(){
    NativeStorage.getItem('supply')
    .then(
      data => this.saveSupplies(data),
      error => console.error(error)
    );
  }

  //Save the supplies in a variable and start extracting the needed ingredients from the recipe
  saveSupplies(data){
    this.supplylist = data;
    if(this.supplylist == undefined){
      this.supplylist = [];
    }

    this.extractIngredients();
  }

  //Extract the list of ingredients and the according amount from an ingredients object
  extractIngredients(){
    let ingredientsSplit = this.recipe.ingredients.split("\n");
    this.ingredientsList = [];

    for (let i of ingredientsSplit) {
      if (i.includes(":")) {
        let ingrItem = {name:i.split(":")[1], menge:i.split(":")[0], id:this.getNewId()};
        this.ingredientsList.push(ingrItem);
      }
    }

    this.neededGroceries = this.ingredientsList;
    this.compareSupplyGroceries();
  }

    //Compare the available supplies and needed groceries
    //Return a list containing the missing groceries
    compareSupplyGroceries(){
    this.missingGroceries = [];
    let missingGrocery = undefined;
    let subtractedAmount;

    //Iterate through the needed groceries and the available supplies to find 
    //matches and check whether the given amount is bigger than the needed amount
    //If the needed amount is bigger calculate the missing amount and save it in the
    //missingGroceries list
    for (let i = this.neededGroceries.length - 1; i >= 0; i--) {
      for (let j = this.supplylist.length - 1; j >= 0; j--) {

        this.title1 = this.supplylist[j].name;
        this.title2 = this.neededGroceries[i].name;

        //CHeck whether an element of the needed groceries list equals an element of the supply list
        if(this.title1.trim() == this.title2.trim()){
          subtractedAmount = this.subtractTwoAmounts(this.neededGroceries[i].menge.trim(), this.supplylist[j].menge.trim());
          //Add the grocery to the missing list if the supply amount is lower than the needed amount
          if(this.separateAmount(subtractedAmount) > 0){
            missingGrocery = this.neededGroceries[i];
            missingGrocery.menge = subtractedAmount;
            this.missingGroceries.push(missingGrocery);
          }
          //Mark the current grocery as available
          missingGrocery = [];
          //Break the current loop
          j = -1;
        }
      }

      //Add the needed grocery to the missing list if it isnt in the supply list
      if(missingGrocery == undefined){
        missingGrocery = this.neededGroceries[i];
        this.missingGroceries.push(missingGrocery);
      }
      missingGrocery = undefined;

    }
    this.itemlist = this.missingGroceries;
  }

  //Add a single grocery to the item list containing items which the user needs to buy
  addSingleGrocery(singleGrocery){
    this.itemlist.push(singleGrocery);
  }

  subtractTwoAmounts(amount1, amount2){
    let amount, unit;
    
    unit = this.separateUnit(amount1);
    amount = this.separateAmount(amount1) - this.separateAmount(amount2);

    return amount + " " + unit;
  }

  ionViewDidLoad() {}

  addGrocery(){
    //Save the added grocery
    this.newItem={name:this.newGrocery, menge:this.newAmount, wertung:"3", id:this.getNewId()};
    this.itemlist.push(this.newItem);
  }

  getNewId(){
    let id = (Math.floor(Math.random() * 1000) + 1); 
    return id;
  }

  increaseGrocery(id){
    //Increase the amount of the chosen grocery
    this.currentId = id;
    let amount = this.getAmountById(id);
    let unit = this.separateUnit(amount);
    amount = this.separateAmount(amount);
    amount = this.increaseAmount(amount);
    this.saveNewAmountById(amount+" "+unit, id);
  }

  reduceGrocery(id){
    //Reduce the amount of the chosen grocery
    this.currentId = id;
    let amount = this.getAmountById(id);
    let unit = this.separateUnit(amount);
    amount = this.separateAmount(amount);
    amount = this.reduceAmount(amount);
    this.saveNewAmountById(amount+" "+unit, id);
  }

  deleteGrocery(id){
    //Delete the amount of the chosen grocery
    for (let i = this.itemlist.length - 1; i >= 0; i--) {
      if(this.itemlist[i].id == id){
        this.itemlist.splice(i, 1);
      }
    }
  }

  increaseAmount(amount){
    //Increase the given amount
    let groceryAmount = +amount;
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
    let groceryAmount = +amount;
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
    let grocerylist;
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
