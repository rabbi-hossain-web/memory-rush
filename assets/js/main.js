'use strict';
//Declaring variables
let count = 0;
let activeItems = [];
let arr1;
let arr2;
let arr3;
let playing = false;
let pair = 0;
let mainTime;
let lowestTime;
let timeScore=0;
let storedScore;
let previousCards = [];
const GameMenu = document.getElementById("game_menu");
const cardItem = document.querySelectorAll('.card-item');
const stopWatch = document.getElementById('timerToggle');
const soundIcon = document.getElementById('soundToggler');
const gameSettings = {
    sound: true,
    cardWatchTime: 900,
    matchedTime: 600,
    resetScores: false,
    gameMode: 'classic',
};
const timeLeft = 100;

const sfxCardFlip = new Audio("assets/sfx/card-flip.mp3");
const sfxCardMatch = new Audio("assets/sfx/card-match.mp3");
const sfxGameFinish = new Audio("assets/sfx/game-finish.mp3");
const sfxSelect = new Audio("assets/sfx/select.mp3");
const sfxBG = new Audio();
sfxBG.src = document.getElementById("bg-audio").src;
sfxBG.volume = 0.1;
sfxBG.loop = true;

var confettiSettings = { target: 'my-canvas', max: 50 };
var confetti = new ConfettiGenerator(confettiSettings);


  

const customAlert = Swal.mixin({
    position: 'center',
    showConfirmButton: true,
    timer: 5000,
    timerProgressBar: true,
});

 
// Declaring Functions
const menuBtn = function(){
    timeScore = 0;
    document.getElementById("timer").innerHTML = "0.00";
    document.getElementById("game_menu").classList.toggle("remove");
    document.getElementById("end-display").classList.toggle("remove");
    document.getElementById("my-canvas").classList.toggle("active");
    document.getElementById("ovly").classList.toggle("remove");
    stopWatch.classList.remove('popAnim');
    clearInterval(mainTime);
    playing = false;
    initClassicPlay(8);
    sfxSelect.play();
    
}
const menuBtnSide = function(){
    timeScore = 0;
    document.getElementById("timer").innerHTML = "0.00";
    document.getElementById("game_menu").classList.toggle("remove");
    stopWatch.classList.remove('popAnim');
    clearInterval(mainTime);
    playing = false;
    initClassicPlay(8);
    sfxSelect.currentTime=0;
    sfxSelect.play();


}
const restartGame = function(){
    // activeItems = '';
    timeScore = 0;
    document.getElementById("timer").innerHTML = "0.00";
    document.getElementById("end-display").classList.toggle("remove");
    stopWatch.classList.remove('popAnim');
    document.getElementById("my-canvas").classList.toggle("active");
    document.getElementById("ovly").classList.toggle("remove");
    initClassicPlay(8);
    sfxSelect.play();
}
const restartGameSideBar = function(){
    timeScore = 0;
    document.getElementById("timer").innerHTML = "0.00";
    stopWatch.classList.remove('popAnim');
    clearInterval(mainTime);
    playing = false;
    initClassicPlay(8);
    sfxSelect.currentTime=0;
    sfxSelect.play();
}

const endGame = function(){
    if(timeScore < lowestTime || lowestTime === 0){
        lowestTime = timeScore;
        localStorage.setItem("lowestScore", lowestTime);
        confetti.render();
        document.getElementById("newScore").innerHTML = "New";
    }
    else{
        document.getElementById("newScore").innerHTML = "";
    }
    sfxGameFinish.play();
    document.getElementById('currentScore').innerHTML = timeScore;
    document.getElementById('high-score').innerHTML = parseFloat(lowestTime).toFixed(2);
    document.getElementById('side-high-score').innerHTML = parseFloat(lowestTime).toFixed(2);
    timeScore = 0;
    document.getElementById("end-display").classList.remove('remove');
    document.getElementById("my-canvas").classList.toggle("active");
    document.getElementById("ovly").classList.remove('remove');
    confetti.render();
}

const classicPlay = function(){
    gameSettings.gameMode = 'classic';
    sfxSelect.play();
    sfxBG.play();
    GameMenu.classList.add("remove");
    setTimeout(function(){
        customAlert.fire({
            icon: 'info',
            title: 'Classic',
            text: 'In this mode try to memorize and solve every pair of cards. Timer starts as soon as you click a card. Every second counts. Good luck :)',
        });
    },300);
}

const timeAttackPlay = function(){
    gameSettings.gameMode = 'timeAttack';
    document.getElementById('timer').innerHTML = timeLeft.toFixed(2);
    sfxSelect.play();
    sfxBG.play();
    GameMenu.classList.add("remove");
    setTimeout(function(){
        customAlert.fire({
            icon: 'warning',
            title: 'Under Construction',
            text: 'You have 100 seconds to solve as many pair as you can. Hurry up :0',
        });
    },300);

}
const settingsHandle = function(){
    customAlert.fire({
        icon: 'warning',
        title: 'Coming Soon',
        text: 'This option is still under development. Expect in next upcoming updates :)',
    });
}

const countTime = function(){
    let startTime = Date.now();
    mainTime = setInterval(function() {
            let elapsedTime = Date.now() - startTime;
            timeScore = (elapsedTime / 1000).toFixed(2)
            document.getElementById("timer").innerHTML = timeScore;
    }, 25);
}

const reverseTimeCount = function(){
    let subTime = Date.now();
    mainTime = setInterval(function() {
        let elapsedTime = Date.now() - subTime;
        timeScore = (elapsedTime / 1000)
        timeScore = timeLeft - timeScore;
        if(timeScore <= 0){
            clearInterval(mainTime);
            timeScore = 0;
            endGame();
        }
        document.getElementById("timer").innerHTML = timeScore.toFixed(2);
    }, 25);
}

const preLoader = function(){
    setTimeout(function(){
        document.getElementById('pre-loader').classList.add('removeLoad');
    }, 700);
}


const soundToggler = function(id){
    sfxSelect.currentTime = 0;
    sfxSelect.play();
    if(gameSettings.sound == true){
        gameSettings.sound = false;
        sfxCardFlip.volume = 0;
        sfxCardMatch.volume = 0;
        sfxGameFinish.volume = 0;
        sfxSelect.volume = 0;
        sfxBG.volume = 0;
    }
    else{
        gameSettings.sound = true;
        sfxCardFlip.volume = 1;
        sfxCardMatch.volume = 1;
        sfxGameFinish.volume = 1;
        sfxSelect.volume = 1;
        sfxBG.volume = 0.2;
    }
    soundIcon.classList.toggle('off')
}

const shuffle = function(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

const resetActiveCards = function(){
    document.getElementById(activeItems[0]).classList.remove('active');
    document.getElementById(activeItems[1]).classList.remove('active');
    activeItems = [];
    count=0;
}
const matchedCards = function(){
    document.getElementById(activeItems[0]).classList.add('matched');
    document.getElementById(activeItems[1]).classList.add('matched');
    activeItems = [];
    count=0;
}






// Randomizing Card ID number

const initClassicPlay = function(pairNumber){
    arr1 = [];
    arr2 = [];
    arr3 = [];
    pair = 0;
    activeItems = [];
    count = 0;
    storedScore = localStorage.getItem("lowestScore");
    if(storedScore !== null){
        lowestTime = parseFloat(storedScore);
    }
    else{
        lowestTime = 0.00;
    }
    while(arr1.length <= pairNumber){
        //If there are n number of icons in the folder then multiply by n+1
        let r = Math.floor(Math.random() * 51);
        if(arr1.indexOf(r) === -1) arr1.push(r);
    }
    
    arr2 = [...arr1];
    shuffle(arr2);
    
    arr3 = [...arr1 ,...arr2 ];

    for(let i=0;i<arr3.length; i++)
    document.getElementById(i).children[1].children[0].src = `assets/card icons/${arr3[i]}.png`;

    for (let i = 0; i < cardItem.length; i++)
    cardItem[i].classList.remove('matched', 'active');
    
    document.getElementById('side-high-score').innerHTML = parseFloat(lowestTime).toFixed(2);
}

initClassicPlay(8);

const cardReplace = function(pairNumber){
    arr1 = [];
    while(arr1.length <= pairNumber){
        //If there are n number of icons in the folder then multiply by n+1
        let r = Math.floor(Math.random() * 51);
        if(arr1.indexOf(r) === -1) arr1.push(r);
    }
    for(let i=0;i<previousCards.length; i++)
    document.getElementById(i).children[1].children[0].src = `assets/card icons/${previousCards[i]}.png`;

    for (let i = 0; i < cardItem.length; i++)
    cardItem[i].classList.remove('matched', 'active');
}


// On Click Event
const response = function(id)
{   if(gameSettings.gameMode === 'classic'){
        if(playing != true){
            playing = true;
            countTime();
        }
        document.getElementById('timerToggle').classList.remove('popAnim');
        document.getElementById('timerToggle').classList.add('popAnim');
        sfxCardFlip.currentTime=0;    
        sfxCardFlip.play();

        if(count < 2 && activeItems[0] !== id){
            document.getElementById(id).classList.add('active');
            activeItems.push(id);
            count++;
            if(count == 2){
                if(arr3[activeItems[0]] == arr3[activeItems[1]]){
                    setTimeout(matchedCards, gameSettings.matchedTime);
                    pair++;
                    sfxCardMatch.play();
                    if(pair === 9){
                        document.getElementById(id).classList.toggle('active');
                        clearInterval(mainTime);
                        playing = false;
                        setTimeout(endGame, 1300);
                        pair = 0;
                        document.getElementById(id).classList.toggle('active');

                    }
                }
                else{
                    setTimeout(resetActiveCards, gameSettings.cardWatchTime);
                }
            }
        }
        else{
            console.log("Please wait before another click");
        }
    }
    else if(gameSettings.gameMode === 'timeAttack'){
        if(playing != true){
            playing = true;
            reverseTimeCount();
        }
        document.getElementById('timerToggle').classList.remove('popAnim');
        document.getElementById('timerToggle').classList.add('popAnim');
        sfxCardFlip.currentTime=0;    
        sfxCardFlip.play();
        
        if(count < 2 && activeItems[0] !== id){
            document.getElementById(id).classList.add('active');
            activeItems.push(id);
            count++;
            if(count == 2){
                if(arr3[activeItems[0]] == arr3[activeItems[1]]){
                    previousCards.push(activeItems[0],activeItems[1]);
                    setTimeout(matchedCards, gameSettings.matchedTime);
                    pair++;
                    sfxCardMatch.play();
                    if(pair === 4){
                        pair = 0;
                        console.log(previousCards);
                        cardReplace(4);
                    }
                }
                else{
                    setTimeout(resetActiveCards, gameSettings.cardWatchTime);
                }
            }
        }
        else{
            console.log("Please wait before another click");
        }
    }
    else{
        console.log("GAME MODE ERROR");
    }
    
}



