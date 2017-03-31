import { ElementRef, Component, ViewChild, NgModule } from '@angular/core';
import { Slides, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from './safe-html-pipe';
import { AlertController } from 'ionic-angular';

@NgModule({
    declarations: [SafePipe]
})

@Component({
    selector: 'page-cooking-mode',
    templateUrl: 'cooking-mode.html', 
})
   

export class CookingModePage {
    @ViewChild('RecipeStepSlider') recipeStepSlider: Slides;
    @ViewChild('TitleContainer') titleContainer: ElementRef;
    @ViewChild('MediaContainer') mediaContainer: ElementRef;
    @ViewChild('InstructionContainer') instructionContainer: ElementRef;
   
    videoIds = [];
    countdown1 = {
        name: "1",
        isTicking: false,
        time: 20,
        timer: 1
    }

    countdown2 = {
        name: "2",
        isTicking: false,
        time: 20,
        timer: 1
    }

    countdown3 = {
        name: "3",
        isTicking: false,
        time: 20,
        timer: 1
    }

    countdown4 = {
        name: "4",
        isTicking: false,
        time: 20,
        timer: 1
    }

    buttonEvents = {
        "Ids": [
            {
                "number": 0,
                "name": ""
            }
        ]
    };
    //Html-Referenz des div-containers für AnweisungsContainer
    safeInstructionHtml;
    //Html-Referenz des div-containers für MedienContainer
    safeMediaHtml;
    safeTitleHtml;
    title: any;
    recipe: any;
    ingredients: any;
    data: any;

    constructor(public alertCtrl: AlertController, public navCtrl: NavController, public sanitizer: DomSanitizer, public navParams: NavParams) {
        this.recipe = navParams.get("recipe");
        var cookModeStrings = this.fetchData();
        var titleString = this.fetchTitleString();
        this.ingredients = [];
        this.getIngredients();
        this.title = titleString;
        //document.getElementById('recipe-title').innerHTML = this.title;
        var imageString = this.fetchImageString();
        //document.getElementById('media-container').innerHTML = imageString;
        var ingredientStrings = this.fetchIngredients();
        var prepareStrings = this.preparations;
        var slideStrings = this.splitData(cookModeStrings,prepareStrings);
        //this.checkTutorials(cookModeStrings, prepareStrings);
        var cookStrings = this.splitSlideStrings(slideStrings);
       // document.getElementById('prepareVideo').style.visibility = "visible";      
        this.updateText(cookStrings, ingredientStrings);
    }
    

    getIngredients() {
        let all = this.recipe.ingredients.split("\n");

        for (let i of all) {
            if (i.includes(":")) {
                i = i.split(":");
            } else {
                i = i.split("-")[0];
            }
            this.ingredients.push(i);
        }

    }

    checkTutorials(cookModeStrings, prepareStrings) {
        console.log("checkTutorials");
    }

    fetchImageString() {
        var imageString = this.recipe.img;
        return imageString;
    }

    fetchTitleString() {
        this.title = this.recipe.title;
    }

    //wird bei der Initialisierung des Sliders Aufgerufen, also auf Stufe 1 des Rezepts gesetzt
    ngAfterViewInit() {
        this.updateSlideContent(0);
    }

    //Updated den Content der Slide abhängig vom aktuellen Index(also der aktuellen Rezeptstufe)
    updateSlideContent(index: any) {      
        var url = [];
        var v = document.getElementById('prepareVideo');
        if (this.videoIds[index] != -1) {
            console.log("Auf Slide " + index + "wird das Video " + this.videoIds[index] + "zu" + this.preparations[this.videoIds[index]].procedure + "mit dem Link" + this.preparations[this.videoIds[index]].link);       
             url.push( this.preparations[this.videoIds[index]].link);
            // url = "https://www.youtube.com/embed/IcFs6vBa1qY";
             v.setAttribute("src", url[index]);       
        } else {
            url.push("");
            v.style.visibility = "hidden";
        }
        console.log(url);

        this.safeTitleHtml = this.getTitleHTML(this.title);
        //erstellt ein "sicheres" HTML aus dem übergebenen String für die Kochanweisungen
        this.safeInstructionHtml = this.getInstructionHTML(this.data.Slides[index].step);       
        //erstellt ein "sicheres" HTML aus dem übergebenen String für die Medien
        this.safeMediaHtml = this.getMediaHTML(this.data.Slides[index].step, this.data.Slides[index].image, url[index]);
    }
    getTitleHTML(title: String) {
        let titleHTML = '<h2>' +title + '</h2>'       
        return this.sanitizer.bypassSecurityTrustHtml(titleHTML);
    }
    //Erstellt das HTML für die Anweisungen. 
    //Zu ergänzen: Markup für Zutaten, Links für Zeitangaben, Funktion zum Timerstarten
    //Beispiel für Hyperlink mit onClickEvent
    //timerLink = `<a href="#" onClick="startTimer();">{Zeitangabe}</a>`;
    getInstructionHTML(step: String) {
        //var showCancelAlert = this.showCancelAlert();     
        let instructionHtml = `<p #step>` + step + `</p>`;
        return this.sanitizer.bypassSecurityTrustHtml(instructionHtml);
    }

    //Erstellt das HTML für den Mediencontainer. 
    //Zu ergänzen: Funktion die abhängig von der aktuellen "step" nach passenden Videos sucht
    //Falls Video vorhanden wird Video angezeigt, sonst Bild
    getMediaHTML(step: String, imageURL: String, videoIds: String) {
        let imageHtml = `<img src="` + imageURL + `" alt = "Rezeptbild" >`;
        return this.sanitizer.bypassSecurityTrustHtml(imageHtml);
    }

    showCountdownAlert() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Welchen Timer wollen Sie starten?'); 
    for (var i = 1; i < this.buttonEvents.Ids.length; i++) {
        alert.addInput({
            type: 'radio',
            label: this.buttonEvents.Ids[i].number+":00" + this.buttonEvents.Ids[i].name,
            value: this.buttonEvents.Ids[i].number + " " + this.buttonEvents.Ids[i].name,
            checked: false
        });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
          if (data != null) {
              this.handleCountdowns(data);
          }
      }
    });
    alert.present();
  }
     handleCountdowns(data) {
         var number;
         var name;
         for (var i = 0; i < data.length; i++) {
             if (data[i] == " ") {
                 number = data.substring(0, i);
                 name = data.substring(i + 1, data.length);
             }
         }
         number = number * 60;        
         if (!this.countdown1.isTicking) {            
             this.countdown1.name = name;
             this.runCountdown(number);
         } else if (!this.countdown2.isTicking) {           
             this.countdown2.name = name;
             this.runCountdownTwo(number);
         } else if (!this.countdown3.isTicking) {           
             this.countdown3.name = name;
             this.runCountdownThree(number);
         } else if (!this.countdown4.isTicking) {           
             this.countdown4.name = name;
             this.runCountdownFour(number);
         }
    }

    // updatet die aktuelle Slide bei Wechsel
    stepChanged() {
        let currentIndex = this.recipeStepSlider.getActiveIndex();
        this.updateSlideContent(currentIndex);
     }

    //gets the recipe string
    fetchData() {
        this.data = this.recipe.instructions;
    }

    //gets the ingredient list
    fetchIngredients() {
        return this.ingredients;
    }

    //splits the recipe string into the slide strings
    splitData(strings,prepareStrings) {
        var dataLength = strings.length - 1;
        var swipeTextSplits = [];
        var counter = 0;
        var startTabChar = 0;
        var lastLineBreak = 0;
        this.videoIds.push(-1);
        for (var i = 0; i < dataLength; i++) {
            var str = strings.substring(i, i + 1);
            if (str == "\n") {
                swipeTextSplits[counter] = strings.substring(startTabChar, i);
                startTabChar = i + 1;
                this.videoIds.push(-1);
                for (var j = 0; j < prepareStrings.length; j++) {
                    if (strings.substring(lastLineBreak,i).includes(prepareStrings[j].procedure)) {
                        console.log(strings.substring(lastLineBreak, i)+ "include" + j + prepareStrings[j].procedure);
                        this.videoIds[counter] = j;
                        break;
                    }
                }     
                counter++;
                lastLineBreak = i;
            }
        }
        console.log(this.videoIds);
        return swipeTextSplits;
    }

    //splits each slidestrings into the words
    splitSlideStrings(slideStrings) {      
        var slideNumber = slideStrings.length;       
        for (var i = 0; i < slideNumber; i++) {
            var lastWhiteSpace = 0;
            var t = 0;
            while (slideStrings[i][t] == " ") {             
                slideStrings[i] = slideStrings[i].substring(t+1, slideStrings[i].length);
                t++;
            }
            var wordStrings = [];
            var characterNumber = slideStrings[i].length;
            for (var j = 0; j < characterNumber; j++) {
                if (slideStrings[i][j] == " ") {
                    wordStrings.push(slideStrings[i].substring(lastWhiteSpace, j));
                    lastWhiteSpace = j + 1;
                }
            }
            slideStrings[i] = wordStrings;
        }
        return slideStrings;
    }

    //text gets its markup
    updateText(wordStrings, ingredientStrings) {      
        var counter = 0;
        var slidesCounter = wordStrings.length;
        var lastNumber = 1;
        for (var i = 0; i < slidesCounter; i++) {         
            //add slide to data.Slides
            if (i > 0) {
                this.data.Slides.push({ "image": "", "step": "" });
            }
            var isIngredient, isNumber, isTimeMark;
            var wordCounter = wordStrings[i].length;
            for (var j = 0; j < wordCounter; j++) {
                isIngredient = this.checkForIngredient(wordStrings[i][j], ingredientStrings);
                if (isNumber) {
                    isTimeMark = this.checkForTimeMark(wordStrings[i][j]);                  
                }
                if (!isIngredient) {
                    isNumber = this.checkForNumber(wordStrings[i][j]);
                    if (isNumber) {
                        lastNumber = wordStrings[i][j];
                    }
                }
                if (isTimeMark) {
                    if (lastNumber >= 10) {
                        this.data.Slides[i].step = this.data.Slides[i].step.substring(0, (this.data.Slides[i].step.length) - 3) + "<a>"+wordStrings[i][j-1] + " " + wordStrings[i][j] + "</a>";
                    } else {
                        this.data.Slides[i].step = this.data.Slides[i].step.substring(0, (this.data.Slides[i].step.length) - 2) + "<a>" + wordStrings[i][j - 1] + " " + wordStrings[i][j] + "</a>";
                    }
                    var name = " ";
                    var plusCounter = j;
                    var minusCounter = j;
                    while (name == " ") {
                        if (plusCounter < wordStrings[i].length) {
                            for (var b = 0; b < ingredientStrings.length; b++) {
                                if (wordStrings[i][plusCounter] == ingredientStrings[b]) {
                                    name = ingredientStrings[b];
                                    break;
                                } 
                            } 
                        }
                        if (minusCounter>-1) {
                            for (var b = 0; b < ingredientStrings.length; b++) {
                                if (wordStrings[i][minusCounter] == ingredientStrings[b]) {
                                    name = ingredientStrings[b];
                                    break;
                                }
                            }
                        }
                        plusCounter++;
                        minusCounter--;
                    }
                    this.buttonEvents.Ids.push({ number: wordStrings[i][j - 1], name: name});
                    counter++;
                    
                    isTimeMark = false;
                } else if (isIngredient) {
                    this.data.Slides[i].step += "<b>" + wordStrings[i][j] + "</b>";
                } else { 
                    this.data.Slides[i].step += wordStrings[i][j];
                }
                this.data.Slides[i].step += " ";         
            }
        }
    }

    handleTimerOne() {
        if (!this.countdown1.isTicking) {
            this.runCountdown(this.countdown1.time);
        } else {
            var remainingTime = document.getElementById('countdownTimer1').innerHTML;
            var temp = document.getElementById('countdownTimer1').innerHTML;
            for (var i = 0; i < temp.length; i++) {
                if (temp[i] == " ") {
                    remainingTime = temp.substring(0, i);
                }
            }
            this.stopCountdown(remainingTime);
        }
    }

    handleTimerTwo() {
        if (!this.countdown2.isTicking) {
            this.runCountdownTwo(this.countdown2.time);
        } else {
            var remainingTime = document.getElementById('countdownTimer2').innerHTML;
            var temp = document.getElementById('countdownTimer2').innerHTML;
            for (var i = 0; i < temp.length; i++) {
                if (temp[i] == " ") {
                    remainingTime = temp.substring(0, i);
                }
            }
            this.stopCountdownTwo(remainingTime);
        }
    }

    handleTimerThree() {
        if (!this.countdown3.isTicking) {
            this.runCountdownThree(this.countdown3.time);
        } else {
            var remainingTime = document.getElementById('countdownTimer3').innerHTML;
            var temp = document.getElementById('countdownTimer3').innerHTML;
            for (var i = 0; i < temp.length; i++) {
                if (temp[i] == " ") {
                    remainingTime = temp.substring(0, i);
                }
            }
            this.stopCountdownThree(remainingTime);
        }
    }

    handleTimerFour() {
        if (!this.countdown4.isTicking) {
            this.runCountdownFour(this.countdown4.time);
        } else {
            var remainingTime = document.getElementById('countdownTimer4').innerHTML;
            var temp = document.getElementById('countdownTimer4').innerHTML;
            for (var i = 0; i < temp.length; i++) {
                if (temp[i] == " ") {
                    remainingTime = temp.substring(0, i);
                }
            }
            this.stopCountdownFour(remainingTime);
        }
    }

    runCountdown(number) {
        this.countdown1.time = number;
        var time = this.countdown1.time;      
        this.countdown1.isTicking = true; 
        var name = this.countdown1.name;           
        if (time > 0) {
            var ct = this.countdown1;
            ct.timer = setInterval(function () {
                if (time > 0) {
                    time--;
                }
                document.getElementById('countdownTimer1').innerHTML = time + "  " + name;
                document.getElementById('countdownTimer1').style.visibility = "visible";
                if (time == 0) {
                    document.getElementById('countdownTimer1').style.visibility = "hidden";
                    window.clearInterval(ct.timer);
                    ct.isTicking = false;
                }
            }, 1000);
        }      
    }
 
    stopCountdown(remainingTime) {
        this.countdown1.isTicking = false;
        clearInterval(this.countdown1.timer);
        this.countdown1.time = remainingTime;
    }

    runCountdownTwo(number) {
        document.getElementById('countdownTimer1').style.visibility = "visible";
        this.countdown2.time = number;
        var time = this.countdown2.time;
        this.countdown2.isTicking = true;
        var name = this.countdown2.name;
        if (time > 0) {
            var ct = this.countdown2;
            ct.timer = setInterval(function () {
                if (time > 0) {
                    time--;
                }
                document.getElementById('countdownTimer2').innerHTML = time + "  " + name;
                document.getElementById('countdownTimer2').style.visibility = "visible";
                if (time == 0) {
                    document.getElementById('countdownTimer2').style.visibility = "hidden";
                    window.clearInterval(ct.timer);
                    ct.isTicking = false;
                }
            }, 1000);
        } 
    }

    runCountdownThree(number) {
        this.countdown3.time = number;
        var time = this.countdown3.time;
        this.countdown3.isTicking = true;
        var name = this.countdown3.name;       
        if (time > 0) {
            var ct = this.countdown3;
            ct.timer = setInterval(function () {
                if (time > 0) {
                    time--;
                }
                document.getElementById('countdownTimer3').innerHTML = time + "  "+ name;
                document.getElementById('countdownTimer3').style.visibility = "visible";
                if (time == 0) {
                    document.getElementById('countdownTimer3').style.visibility = "hidden";
                    window.clearInterval(ct.timer);
                    ct.isTicking = false;
                }
            }, 1000);
        } 
    }

    runCountdownFour(number) {
        this.countdown4.time = number;
        var time = this.countdown4.time;
        this.countdown4.isTicking = true;
        var name = this.countdown4.name;       
        if (time > 0) {
            var ct = this.countdown4;
            ct.timer = setInterval(function () {
                if (time > 0) {
                    time--;
                }
                document.getElementById('countdownTimer4').innerHTML = time + "  "+ name;
                document.getElementById('countdownTimer4').style.visibility = "visible";
                if (time == 0) {
                    document.getElementById('countdownTimer4').style.visibility = "hidden";
                    window.clearInterval(ct.timer);
                    ct.isTicking = false;
                }
            }, 1000);
        } 
    }

    stopCountdownTwo(remainingTime) {
        this.countdown2.isTicking = false;
        clearInterval(this.countdown2.timer);
        this.countdown2.time = remainingTime;
    }

    stopCountdownThree(remainingTime) {
        this.countdown3.isTicking = false;
        clearInterval(this.countdown3.timer);
        this.countdown3.time = remainingTime;
    }

    stopCountdownFour(remainingTime) {
        this.countdown4.isTicking = false;
        clearInterval(this.countdown4.timer);
        this.countdown4.time = remainingTime;
    }

    checkForTimeMark(word) {
        if (word == "Minuten") {
            return true;
        }
        return false;
    }

    checkForNumber(word) {
        return !isNaN(parseFloat(word)) && isFinite(word);
    }

    checkForIngredient(word, ingredientStrings) {
        var ingredientCounter = ingredientStrings.length;
        for (var k = 0; k < ingredientCounter; k++) {
            if (word == ingredientStrings[k]) {
                return true;
            }
        }
        return false;
    }
    preparations = [
        {
            "procedure": "Zwiebel klein schneiden",
            "link": "https://www.youtube.com/embed/IcFs6vBa1qY"
        },
        {
            "procedure": "Paprika fein würfeln",
            "link": "https://www.youtube.com/embed/sjVeeZ6ZVr8"
        },
        {
            "procedure": "Paprika gefüllt",
            "link": "https://www.youtube.com/embed/zqd2InS-vz0"
        }];
}
