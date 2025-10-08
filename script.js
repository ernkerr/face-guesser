import { roundGenerator } from "./utils/roundGenerator.js";
import { handleClickGuess, handleExpertGuess } from "./utils/guessHandler.js";
import { initAnimations, playAnimation } from "./ui/animations.js";
import {
  showGameScreen,
  showGameOverScreen,
  showTitleScreen,
} from "./ui/screens.js";
import {
  gameState,
  updateScore,
  removeLife,
  resetGame,
  setMode,
  setAnswerIndex,
  addRound,
} from "./utils/gameState.js";
import {
  updateScoreDisplay,
  updateQuestion,
  removeHeart,
} from "../ui/updater.js";
import { loginWithSpotify } from "./auth/supabase.js";

await initAnimations(); // preload JSONs

// MVP:
// make database for people with name + image
const options = [
  { name: "Martin Garrix", source: "images/martin_garrix.png", category: "dj" },
  { name: "David Guetta", source: "images/david_guetta.png", category: "dj" },
  { name: "Alok", source: "images/alok.png", category: "dj" },
  { name: "Fred Again...", source: "images/fred_again.png", category: "dj" },
  { name: "Timmy Trumpet", source: "images/timmy_trumpet.png", category: "dj" },
];

const startBtn = document.getElementById("start-btn");
let modeBtn = document.getElementById("mode-btn");
const gridItems = document.querySelectorAll(".grid-item");
const nextBtn = document.getElementById("next");

// TODO: add gelatine animation to animations

// User clicks “Login with Spotify”
const spotifyBtn = document.getElementById("spotify-btn");
spotifyBtn.addEventListener("click", loginWithSpotify);

// ======= CATEGORY =======
// let categoryTitle = category.toUpperCase();
// document.getElementById("category").textContent = `${categoryTitle}`;
// P2: let user select a category (must be logged in error toast)
// if they are logged in then they can switch the category like they can switch the mode
// get that user's category: artist, rapper,  country singer, etc.

let category = "dj";
let filteredOptions = options.filter((option) => option.category === category); // filter for the selected category

// =========================================
// START GAME
// =========================================

startBtn.addEventListener("click", () => {
  setTimeout(() => {
    showGameScreen();
    setAnswerIndex(roundGenerator(filteredOptions, gameState.mode, gridItems)); // start first round
  }, 500); // match the CSS transition time
});

// =========================================
// MODE SWITCH
// =========================================

const modes = ["easy", "normal", "expert"];
modeBtn.textContent = `Mode: ${gameState.mode}`; // initialize mode text
modeBtn.addEventListener("click", switchMode);

// hide input + next button by default
const expertModeContainer = document.getElementById("expert-mode");
expertModeContainer.style.display = "none";

function switchMode() {
  const currentIndex = modes.indexOf(gameState.mode); // get the current mode's index
  const nextIndex = (currentIndex + 1) % modes.length; // get next index (wraps back to 0)
  gameState.mode = modes[nextIndex]; // update mode
  modeBtn.textContent = `Mode: ${gameState.mode}`; // update button text

  // if in expert mode, show the expert mode container
  expertModeContainer.style.display =
    gameState.mode !== "expert" ? "none" : "block";
}

// =========================================
// CLICK CONTROL
// =========================================
function disableGuesses() {
  gridItems.forEach((gridItem) => {
    const img = gridItem.querySelector("img");
    img.style.pointerEvents = "none"; // block clicks
  });
}

// =========================================
// HANDLE NEXT ROUND
// =========================================

function handleNext() {
  //
  // expert mode handles input differently
  if (gameState.mode === "expert") {
    checkExpertGuess();
  }

  // generate new round
  setAnswerIndex(roundGenerator(filteredOptions, gameState.mode, gridItems));
}

// attach next button
nextBtn.addEventListener("click", handleNext);

// =========================================
// GAME OVER SCREEN
// =========================================

function handleGameOver() {
  showGameOverScreen();

  // show score in center
  // TODO: if highscore, ask for name
  // try again

  let tryAgainButton = document.getElementById("try-again");
  tryAgainButton.addEventListener("click", () => {
    location.reload(); // simple reset for now
  });
}

// =========================================
// EXPERT MODE GUESS
// =========================================

// different logic in expert mode
function checkExpertGuess() {
  const guessElement = document.getElementById("guess-input");
  const userGuess = guessElement.value;
  const correctAnswer = filteredOptions[gameState.answerIndex].name;

  const correct = handleExpertGuess(userGuess, correctAnswer);

  // If game over, show screen
  if (gameState.lives === 0) {
    handleGameOver();
  }
  // reset input for the next round
  guessElement.value = "";
  return correct;
}

// =========================================
// GRID ITEM CLICK HANDLER
// =========================================

gridItems.forEach((gridItem) => {
  gridItem.addEventListener("click", (event) => {
    // figure out what was clicked (img or p)
    const target = event.target;
    const guessIndex = parseInt(target.dataset.index);

    // only continue if it was a valid clickable element (has data-index)
    if (!isNaN(guessIndex)) {
      // bounce animation on the WHOLE grid item
      gridItem.classList.remove("gelatine"); // reset
      void gridItem.offsetWidth; // force reflow
      gridItem.classList.add("gelatine"); // re-add

      disableGuesses();

      // run your guess check logic
      // handle click guess will return a true or false
      // if you want to use it in the future
      // const correct = handleClickGuess(guessIndex, gameState.answerIndex);
      handleClickGuess(guessIndex, gameState.answerIndex);

      // If game over, show screen, else go to next round
      if (gameState.lives === 0) {
        handleGameOver();
      } else {
        setTimeout(handleNext, 1000);
      }
    }
  });
});
