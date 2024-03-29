// global constants
 //how long to hold each clue's light/sound
const cluePauseTime = 300; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const clueLength= 6; // length of random pattern
//Global Variables
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var pattern = [];
var progress = 0;
var gamePlaying = false;
var guessCounter = 0;
var clueHoldTime = 500;
var attemptLeft;

function randomPattern(){
 for (let j = 0; j < clueLength; j++){
   pattern[j] = Math.ceil(Math.random() * 6)
}
}
console.log(pattern);


function startGame(){
    //initialize game variables
  console.log(pattern);
    progress = 0;
    gamePlaying = true;
  attemptLeft =3;
  // swap the Start and Stop buttons
document.getElementById("startBtn").classList.add("hidden");
document.getElementById("stopBtn").classList.remove("hidden");
  randomPattern();
  playClueSequence();
}

function stopGame(){
    //initialize game variables
    gamePlaying = false;
  // swap the Start and Stop buttons
document.getElementById("startBtn").classList.remove("hidden");
document.getElementById("stopBtn").classList.add("hidden");
}

//code to generate sound

const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 500,
  6: 250
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

// code for lighting a button 
function lightButton(btn){
  document.getElementById("Button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("Button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter= 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  clueHoldTime = clueHoldTime - 40
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You Won.");
}

function guess(btn){
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    //Guess was correct!
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    }else{
      //so far so good... check the next guess
      guessCounter++;
    }
  }else{
    //Guess was incorrect
    //GAME OVER: LOSE!
   
       attemptLeft= attemptLeft-1;
   alert("You have " + attemptLeft + " tries left")
    if (attemptLeft== 0){
    loseGame();
    }
  }
}    
