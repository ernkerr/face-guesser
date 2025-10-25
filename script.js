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
import {
  createCustomCategories,
  filterArtists,
} from "./categories/customCategories.js";

await initAnimations(); // preload JSONs

const startBtn = document.getElementById("start-btn");
let modeBtn = document.getElementById("mode-btn");
let categoryBtn = document.getElementById("category-btn");
const gridItems = document.querySelectorAll(".grid-item");
const nextBtn = document.getElementById("next");
let filteredOptions;

// TODO: add gelatine animation to animations

// User clicks “Login with Spotify”
const spotifyBtn = document.getElementById("spotify-btn");
spotifyBtn.addEventListener("click", loginWithSpotify);

// =========================================
// CATEGORIES
// =========================================

let categories = await createCustomCategories();

categoryBtn.textContent = `Category: ${gameState.category}`;
categoryBtn.addEventListener("click", switchCategory);

function switchCategory() {
  const currentIndex = categories.indexOf(gameState.category); // get the current category's index
  const nextIndex = (currentIndex + 1) % categories.length; // get the next index (wrap back to 0)
  gameState.category = categories[nextIndex]; // updates the category in game state
  categoryBtn.textContent = `Category: ${gameState.category}`;
}

// =========================================
// START GAME
// =========================================

startBtn.addEventListener("click", () => {
  setTimeout(() => {
    showGameScreen();
    filteredOptions = filterArtists();
    console.log(
      "Filtered Artists passed to round generator: ",
      filteredOptions
    );
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
