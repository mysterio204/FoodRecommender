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
            "procedure": "Essen mit Stäbchen",
            "link": "https://www.youtube.com/embed/CuDjP2-s79k"
        },
        {
            "procedure": "Reispapierrollen falten",
            "link": "https://www.youtube.com/embed/YihI1UVtjlY"
        },

        {
            "procedure": "Granatapfel entkernen",
            "link": "https://www.youtube.com/embed/qnkn3U3lwDg"
        },
        {
            "procedure": "Messer schärfen",
            "link": "https://www.youtube.com/embed/Gz22DExuewI"
        },
        {
            "procedure": "Kirschtomaten schneiden",
            "link": "https://www.youtube.com/embed/Ych9mrd3OHM"
        },
        {
            "procedure": "Schnitzel klopfen",
            "link": "https://www.youtube.com/embed/zEMLkk1jgR8"
        },
        {
            "procedure": "Karotten stiften",
            "link": "https://www.youtube.com/embed/gWs3_nMXrUI"
        },
        {
            "procedure": "Zitrusfrucht filetieren",
            "link": "https://www.youtube.com/embed/gWs3_nMXrUI"
        },
        {
            "procedure": "Ingwer schälen",
            "link": "https://www.youtube.com/embed/x8O5P-c350k"
        },
        {
            "procedure": "Zwiebeln hacken",
            "link": "https://www.youtube.com/embed/O5xv2w55oGM"
        },
        {
            "procedure": "Kartoffelwürfel",
            "link": "https://www.youtube.com/embed/n8XjIaZ6M4Y"
           
        },
        {
            "procedure": "Tournieren",
            "link": "https://www.youtube.com/embed/Vb1udZhc3Gg"
        },   
        {
            "procedure": "Frühlingszwiebeln",
            "link": "https://www.youtube.com/embed/uaE2sLGuyzQ"
        },
        {
            "procedure": "Kartoffelstreifen",
            "link": "https://www.youtube.com/embed/GxGmEIHnyF8"
        },
        {
            "procedure": "Lauchstreifen",
            "link": "https://www.youtube.com/embed/h94simUBQak"
        },
        {
            "procedure": "Tomatenstreifen",
            "link": "https://www.youtube.com/embed/P7QAgWKbTKU"
        },
        {
            "procedure": "Karotten",
            "link": "https://www.youtube.com/embed/eKA4OOgASY"
        },
        {
            "procedure": "Tomatenwürfel",
            "link": "https://www.youtube.com/embed/p-KFAPzuYQ4"
        },
        {
            "procedure": "Zwiebelstreifen",
            "link": "https://www.youtube.com/embed/-rvsn9tMLd8"
        },
        {
            "procedure": "Zwiebelringe",
            "link": "https://www.youtube.com/embed/_hhZRFX4vdg"
        },
        {
            "procedure": "Paprikarauten",
            "link": "https://www.youtube.com/embed/UY5UjJ8zxvw"
        },
        {
            "procedure": "Fenchel",
            "link": "https://www.youtube.com/embed/5fPFewSzvmc"
        },
        {
            "procedure": "Pommes",
            "link": "https://www.youtube.com/embed/GF7I5Y95g60"
        },
        {
            "procedure": "Wok Zwiebeln",
            "link": "https://www.youtube.com/embed/gZy6Vqe9UZk"
        },
        {
            "procedure": "Tomaten häuten",
            "link": "https://www.youtube.com/embed/WT_tZ43XwEE"
        },
        {
            "procedure": "Kürbis schälen",
            "link": "https://www.youtube.com/embed/SdxUkiDTHIk"
        },
        {
            "procedure": "Schokolade schmelzen",
            "link": "https://www.youtube.com/embed/YxdHkDG5xYM"
        },
        {
            "procedure": "Vanilleschoten",
            "link": "https://www.youtube.com/embed/wjAFTK3zF7A"
        },
        {
            "procedure": "Fleisch braten",
            "link": "https://www.youtube.com/embed/MQS3n0yRxw"
        },
        {
            "procedure": "Avocado",
            "link": "https://www.youtube.com/embed/4yMhmybM8WY"
        },
        {
            "procedure": "Fisch braten",
            "link": "https://www.youtube.com/embed/cqCVK421Mzo"
        },
        {
            "procedure": "Huhn zerlegen",
            "link": "https://www.youtube.com/embed/SBeq1t1gT6w"
        },
        {
            "procedure": "Knoblauch",
            "link": "https://www.youtube.com/embed/jPiIo8Z-ecc"
        },
        {
            "procedure": "Paprika",
            "link": "https://www.youtube.com/embed/kPWQqCWn2nM"
        },
        {
            "procedure": "Rhabarber",
            "link": "https://www.youtube.com/embed/mFtq_3Pn9lo"
        },
        {
            "procedure": "Spargel",
            "link": "https://www.youtube.com/embed/oRyhPL1Iizw"
        },
        {
            "procedure": "Fleischrücken ",
            "link": "https://www.youtube.com/embed/MKV0qmZAKYY"
        },
        {
            "procedure": "Zitrusfrucht auspressen",
            "link": "https://www.youtube.com/embed/wRP9y0ThgfU"
        },
        {
            "procedure": "Zitronengras",
            "link": "https://www.youtube.com/embed/gEso6LMSi40  "
            
        },
        {
            "procedure": "Zitrusfrucht schälen",
            "link": "https://www.youtube.com/embed/FakphPqkU5g"
        },

         {
             "procedure": "Champignons schälen",
             "link": "https://www.youtube.com/embed/Egn7Tx1cXak"
         },
         {
             "procedure": "Artischocken schälen",
             "link": "https://www.youtube.com/embed/85EwuO9Op4c&list=PLuQOcm2t-VKNaQWKrSwOJ6qhHFrg28zQu&index=10"
         },
         {
             "procedure": "Schmetterling Schnitt",
             "link": "https://www.youtube.com/embed/JA5vIUfkhJs&list=PLuQOcm2t-VKNaQWKrSwOJ6qhHFrg28zQu&index=13"
         },
         {
             "procedure": "Kräuter hacken",
             "link": "https://www.youtube.com/embed/71iTRK5L3dE&list=PLuQOcm2t-VKNaQWKrSwOJ6qhHFrg28zQu&index=16"
         },
         {
             "procedure": "Mango schneiden",
             "link": "https://www.youtube.com/embed/qu8u-no38Kc&list=PLuQOcm2t-VKNaQWKrSwOJ6qhHFrg28zQu&index=21"
         },
         {
             "procedure": "Schalentier",
             "link": "https://www.youtube.com/embed/Nt2fyH6ewZM&list=PLuQOcm2t-VKNaQWKrSwOJ6qhHFrg28zQu&index=22"
         },
         {
             "procedure": "Austern",
             "link": "https://www.youtube.com/embed/7vUFGqg2jZ4&list=PLuQOcm2t-VKNaQWKrSwOJ6qhHFrg28zQu&index=23"
         },
         {
             "procedure": "Eier pochieren",
             "link": "https://www.youtube.com/embed/rc49HEM5MlY&list=PLuQOcm2t-VKNaQWKrSwOJ6qhHFrg28zQu&index=26"
         },
         {
             "procedure": "Kartoffeln schälen",
             "link": "https://www.youtube.com/embed/Jh4tELgFbYE"
         },
         {
             "procedure": "Kartoffeln schälen",
             "link": "https://www.youtube.com/embed/Jh4tELgFbYE"
         },
         {
             "procedure": "Seezunge braten",
             "link": "https://www.youtube.com/embed/WpMjV4bdGU0&list=PL5MmtYfAtJX1NGHxrlVHw08ljOmHtc12- "
         },
         {
             "procedure": "Thunfisch braten",
             "link": "https://www.youtube.com/embed/i1-qujoaAP0&list=PL5MmtYfAtJX1NGHxrlVHw08ljOmHtc12-&index=2 "
         },
              {
                  "procedure": "Thunfisch braten",
                  "link": "https://www.youtube.com/embed/i1-qujoaAP0&list=PL5MmtYfAtJX1NGHxrlVHw08ljOmHtc12-&index=2 "
              },
              {
                  "procedure": "Garnelen hacken",
                  "link": "https://www.youtube.com/embed/i1-qujoaAP0&list=PL5MmtYfAtJX1NGHxrlVHw08ljOmHtc12-&index=2 "
              },
              {
                  "procedure": "Austern von der Schale lösen",
                  "link": "https://www.youtube.com/embed/PTCuyqS72F4&index=22&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis "
              },
              {
                  "procedure": "Salat waschen",
                  "link": "https://www.youtube.com/embed/KKNeB8EFwPc&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis&index=26 "
              },
              {
                  "procedure": "Rucola waschen",
                  "link": "https://www.youtube.com/embed/SHmjrhe6D00&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis&index=27 "
              },
              {
                  "procedure": "Römersalat waschen",
                  "link": "https://www.youtube.com/embed/DhzJSmSNswM&index=28&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis "
              },
              {
                  "procedure": "Radicchio waschen",
                  "link": "https://www.youtube.com/embed/EdbkhpxI5Wg&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis&index=29 "
              },
              {
                  "procedure": "Hähnchen zerteilen",
                  "link": "https://www.youtube.com/embed/UdptEdoO62Y&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis&index=31"
              },
              {
                  "procedure": "Kalbsfilet entsehnen",
                  "link": "https://www.youtube.com/embed/nrPTRxfUch8&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis&index=33"
              },
              {
                  "procedure": "Kalbsfilet hacken",
                  "link": "https://www.youtube.com/embed/nrPTRxfUch8&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis&index=33"
              },
              {
                  "procedure": "Lachsfilet würfeln  ",
                  "link": "https://www.youtube.com/embed/bfacgQTMVd8&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis&index=36"
              },
              {
                  "procedure": "Lachs würfeln",
                  "link": "https://www.youtube.com/embed/bfacgQTMVd8&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis&index=36 "

              },
              {
                  "procedure": "Langustenfleisch lösen",
                  "link": "https://www.youtube.com/embed/PUKPGDih0dA&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis&index=37 "
              },
              {
                  "procedure": "Feigen würfeln",
                  "link": "https://www.youtube.com/embed/1Li85NoY1TU&index=43&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis "
              },
              {
                  "procedure": "Spargel schälen",
                  "link": "https://www.youtube.com/embed/7lxy9OLa3VQ&list=PL5MmtYfAtJX1JmGCm0i5rfKBW3EFfRjis&index=50 "
              },
              {
                  "procedure": "Granatapfel schälen",
                  "link": "https://www.youtube.com/embed/cuYtlP7e3tw "
              },
              {
                  "procedure": "Avocados schneiden",
                  "link": "https://www.youtube.com/embed/rG_HQVhmU8w "
              },
              {
                  "procedure": "Sternfrucht schneiden",
                  "link": "https://www.youtube.com/embed/o0boUz-ccIQ"
              },
              {
                  "procedure": "Karambole schneiden",
                  "link": "https://www.youtube.com/embed/o0boUz-ccIQ "
              },
              {
                  "procedure": "Kiwano schneiden",
                  "link": "https://www.youtube.com/embed/HK0qR1Ru63A "
              },
              {
                  "procedure": "Drachenfrucht schneiden",
                  "link": "https://www.youtube.com/embed/w_wde8yIopg "
              },
              {
                  "procedure": "Kokosnuss öffnen",
                  "link": "https://www.youtube.com/embed/vGiIeHLgrwo "

              },
              {
                  "procedure": "Pomelo schälen",
                  "link": "https://www.youtube.com/embed/9q2sTIn7G88"
              },
              {
                  "procedure": "Physalis schneiden",
                  "link": "https://www.youtube.com/embed/ReXy2CcQbTY "
              },
              {
                  "procedure": "Orange filetieren",
                  "link": "https://www.youtube.com/embed/pJEEJpfCKAg"
              },
              {
                  "procedure": "Karamellisieren",
                  "link": "https://www.youtube.com/embed/O53hWuwMe88 "
              },
              {
                  "procedure": "Tomate blanchieren",
                  "link": "https://www.youtube.com/embed/D8dQPEK94fE "
              },
              {
                  "procedure": "ablöschen",
                  "link": "https://www.youtube.com/embed/OLQWgk1I6jc&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=2 "
              },
              {
                  "procedure": "Mais lösen",
                  "link": "https://www.youtube.com/embed/dzbFf3BEwbs&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=10 "
              },
              {
                  "procedure": "Hackfleisch braten",
                  "link": "https://www.youtube.com/embed/j0FuoOnZu7s&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=17 "
              },
              {
                  "procedure": "Apfel schneiden",
                  "link": "https://www.youtube.com/embed/EjSfsk0HZ5M&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=19 "
              },
              {
                  "procedure": "Honigmelone schneiden",
                  "link": "https://www.youtube.com/embed/DbJBf_F8Kgw&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=20"
              },
              {
                  "procedure": "Pflaumen schneiden",
                  "link": "https://www.youtube.com/embed/NKt-iOfunW0&index=28&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Kiwi schälen",
                  "link": "https://www.youtube.com/embed/iamQ_S7_KHk&index=33&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Oliven schneiden",
                  "link": "https://www.youtube.com/embed/liz1NwzRXfc&index=34&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml"
              },
              {
                  "procedure": "Oliven entkernen",
                  "link": "https://www.youtube.com/embed/liz1NwzRXfc&index=34&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Kohl schneiden",
                  "link": "https://www.youtube.com/embed/lEbE2KdBueo&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=37 "
              },
              {
                  "procedure": "Milch kochen",
                  "link": "https://www.youtube.com/embed/#Ayi8CPkepew&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=42 "
              },
              {
                  "procedure": "Eier trennen",
                  "link": "https://www.youtube.com/embed/45R9KIwmgdY&index=44&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Speck braten",
                  "link": "https://www.youtube.com/embed/TXUWWqtmRZg&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=45 "
              },
              {
                  "procedure": "Nudeln kochen",
                  "link": "https://www.youtube.com/embed/uBo5UfRTewI&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=47 "
              },
              {
                  "procedure": "Frühlingszwiebel schneiden",
                  "link": "https://www.youtube.com/embed/r79XjFEYLeM&index=48&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Hühnerbrust pochieren",
                  "link": "https://www.youtube.com/embed/lqAYt2dPbeI&index=49&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Kräuter hacken",
                  "link": "https://www.youtube.com/embed/lA9KFdIyaqU&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=50 "
              },
              {
                  "procedure": "Beeren waschen",
                  "link": "https://www.youtube.com/embed/psS_4OUsXFg&index=51&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Passieren",
                  "link": "https://www.youtube.com/embed/EU5BDvrciiY&index=53&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Blumenkohl schneiden",
                  "link": "https://www.youtube.com/embed/GRCi0GnaLsc&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=54 "
              },
              {
                  "procedure": "Eischnee schlagen",
                  "link": "https://www.youtube.com/embed/JOqy3_JzPWc&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=56 "
              },
              {
                  "procedure": "Soße andicken",
                  "link": "https://www.youtube.com/embed/M48AVcF3wdc&index=58&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Mly"
              },
              {
                  "procedure": "Soße abbinden",
                  "link": "https://www.youtube.com/embed/M48AVcF3wdc&index=58&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Öl erhitzen",
                  "link": "https://www.youtube.com/embed/14U3ZInsBn0&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=59 "
              },
              {
                  "procedure": "Mehlschwitze anrühren",
                  "link": "https://www.youtube.com/embed/XZaRZRpitSo&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=61 "
              },
              {
                  "procedure": "Pilze putzen",
                  "link": "https://www.youtube.com/embed/pW_fk_m_EVs&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=62 "
              },
              {
                  "procedure": "Muskatnuss reiben",
                  "link": "https://www.youtube.com/embed/hWcGIwu7nC0&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=64 "
              },
              {
                  "procedure": "Kartoffeln kochen",
                  "link": "https://www.youtube.com/embed/ok5kjt-rpSA&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=65 "
              },
              {
                  "procedure": "Käse reiben",
                  "link": "https://www.youtube.com/embed/eUXJJfnsN0E&index=71&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Käse hobeln",
                  "link": "https://www.youtube.com/embed/eUXJJfnsN0E&index=71&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml"
              },
              {
                  "procedure": "Burger formen",
                  "link": "https://www.youtube.com/embed/1zBlnXR4x8U&index=74&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Panieren",
                  "link": "https://www.youtube.com/embed/4cFKGr6tygA&index=77&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Nüsse rösten",
                  "link": "https://www.youtube.com/embed/YZedD8zlafk&index=83&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Zitrone reiben",
                  "link": "https://www.youtube.com/embed/OquFh7YojhE&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=87 "
              },
              {
                  "procedure": "Vanillemark auskratzen",
                  "link": "https://www.youtube.com/embed/OrIpKLRabYw&index=86&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml "
              },
              {
                  "procedure": "Limette reiben",
                  "link": "https://www.youtube.com/embed/OquFh7YojhE&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=87"
              },
              {
                  "procedure": "Julienne schneiden",
                  "link": "https://www.youtube.com/embed/EA15mROQQUU&list=PLXG7nf0UStAC0q4mwtKPjftKXjy_ep0Ml&index=90 "
              },
              {
                  "procedure": "Spargel kochen",
                  "link": "https://www.youtube.com/embed/UgItELPwHcI&list=PLUyg-1_pxN_VhRainQCMDT8nknkWpm_xp "
              },
              {
                  "procedure": "Wraps falten",
                  "link": "https://www.youtube.com/embed/16gILax2KJ4&list=PLUyg-1_pxN_VhRainQCMDT8nknkWpm_xp&index=10 "
              },
              {
                  "procedure": "Steak braten",
                  "link": "https://www.youtube.com/embed/I_zZSglQthU&index=15&list=PLUyg-1_pxN_VhRainQCMDT8nknkWpm_xp "
              },
              {
                  "procedure": "Rouladen wickeln ",
                  "link": "https://www.youtube.com/embed/7GaZCvospXo&list=PLUyg-1_pxN_VhRainQCMDT8nknkWpm_xp&index=18 "
              },
              {
                  "procedure": "Wild marinieren",
                  "link": "https://www.youtube.com/embed/7CbreKnQbpo&list=PLUyg-1_pxN_VhRainQCMDT8nknkWpm_xp&index=19 "
              },
              {
                  "procedure": "Wild beizen",
                  "link": "https://www.youtube.com/embed/7CbreKnQbpo&list=PLUyg-1_pxN_VhRainQCMDT8nknkWpm_xp&index=19 "
              },
              {
                  "procedure": "Reis kochen",
                  "link": "https://www.youtube.com/embed/fCyHdcC88Ow&index=20&list=PLUyg-1_pxN_VhRainQCMDT8nknkWpm_xp "
              },
              {
                  "procedure": "Eier kochen",
                  "link": "https://www.youtube.com/embed/qSfvpQ23eXY&list=PLUyg-1_pxN_VhRainQCMDT8nknkWpm_xp&index=23 "
              },
              {
                  "procedure": "Sellerie schälen",
                  "link": "https://www.youtube.com/embed/94a4fjNQ76U&index=25&list=PLUyg-1_pxN_VhRainQCMDT8nknkWpm_xp "
              },
              {
                  "procedure": "Rouladen binden",
                  "link": "https://www.youtube.com/embed/rGaS3lG1ZCs "
              },
              {
                  "procedure": "dämpfen",
                  "link": "https://www.youtube.com/embed/nxU5yLHPzUM "
              },
              {
                  "procedure": "Dünsten",
                  "link": "https://www.youtube.com/embed/wyGxy3iOCew"
              },
              {
                  "procedure": "Kalmar waschen",
                  "link": "https://www.youtube.com/embed/wyGxy3iOCew "
              },
              {
                  "procedure": "Sepia waschen",
                  "link": "https://www.youtube.com/embed/wyGxy3iOCew "
              },
              {
                  "procedure": "Austern vorbereiten",
                  "link": "https://www.youtube.com/embed/pbaPhN2ObWY "
              },
              {
                  "procedure": "Hummer auslösen",
                  "link": "https://www.youtube.com/embed/vjKy8RI87Vg "
              },
              {
                  "procedure": "Schmoren",
                  "link": "https://www.youtube.com/embed/Xy3PwAIylSQ    "
              },
              {
                  "procedure": "Kaisergranat zerteilen",
                  "link": "https://www.youtube.com/embed/w5jtSJBHK24 "
              },
              {
                  "procedure": "Garnelen vorbereiten",
                  "link": "https://www.youtube.com/embed/HhlcOIizE5w"
              },
              {
                  "procedure": "Pflaumen dörren",
                  "link": "https://www.youtube.com/embed/3LNAFLFfe48 "
              },
              {
                  "procedure": "Apfelringe dörren",
                  "link": "https://www.youtube.com/embed/3LNAFLFfe48 "
              },

        {
            "procedure": "Knollensellerie schneiden",
            "link": "https://www.youtube.com/embed/LoNatsOGwWQ"
        }];
}
