import { roundGenerator } from "./utils/roundGenerator.js";
import { handleClickGuess, handleExpertGuess } from "./utils/guessHandler.js";
import { initAnimations, playAnimation } from "./ui/animations.js";
import { showGameScreen, showGameOverScreen } from "./ui/screens.js";
import { getState, addSeenArtist, setAnswerIndex, setCategory, setMode } from "./state/store.js";
import { loginWithSpotify } from "./auth/supabase.js";
import { filterArtists, fetchMoreLikedSongs, fetchMoreGenreArtists } from "./categories/customCategories.js";

await initAnimations(); // preload JSONs

const startBtn = document.getElementById("start-btn");
let modeBtn = document.getElementById("mode-btn");
let categoryBtn = document.getElementById("category-btn");
const gridItems = document.querySelectorAll(".grid-item");
const nextBtn = document.getElementById("next");

// User clicks “Login with Spotify”
const spotifyBtn = document.getElementById("spotify-btn");
spotifyBtn.addEventListener("click", loginWithSpotify);

// =========================================
// CATEGORIES
// =========================================

let categories = ["DJ"];
let backgroundFetcher = { intervalId: null };

document.addEventListener("categories-ready", (e) => {
  console.log("Categories ready: ", e.detail);
  categories = e.detail.filter(cat => cat !== 'DJ'); // Remove DJ
  setCategory("Top Artists");
  categoryBtn.textContent = `Category: ${getState().category}`;
  categoryBtn.addEventListener("click", switchCategory);
});

function isGenreCategory(category) {
  return !["Top Artists", "Liked Songs", "DJ"].includes(category);
}

function switchCategory() {
  const currentIndex = categories.indexOf(getState().category);
  const nextIndex = (currentIndex + 1) % categories.length;
  setCategory(categories[nextIndex]);
  categoryBtn.textContent = `Category: ${getState().category}`;

  // Handle background fetching
  clearInterval(backgroundFetcher.intervalId);

  if (getState().category === "Liked Songs") {
    backgroundFetcher.intervalId = setInterval(() => {
      fetchMoreLikedSongs(getState().spotifyToken);
    }, 30000);
  } else if (isGenreCategory(getState().category)) {
    backgroundFetcher.intervalId = setInterval(() => {
      fetchMoreGenreArtists(getState().spotifyToken, getState().category);
    }, 30000);
  }
}

// =========================================
// START GAME
// =========================================

startBtn.addEventListener("click", () => {
  setTimeout(() => {
    showGameScreen();
    const availableArtists = filterArtists();
    setAnswerIndex(roundGenerator(availableArtists, getState().mode, gridItems)); // start first round
  }, 500); // match the CSS transition time
});

// =========================================
// MODE SWITCH
// =========================================

const modes = ["easy", "normal", "expert"];
modeBtn.textContent = `Mode: ${getState().mode}`; // initialize mode text
modeBtn.addEventListener("click", switchMode);

// hide input + next button by default
const expertModeContainer = document.getElementById("expert-mode");
expertModeContainer.style.display = "none";

function switchMode() {
  const currentIndex = modes.indexOf(getState().mode); // get the current mode's index
  const nextIndex = (currentIndex + 1) % modes.length; // get next index (wraps back to 0)
  setMode(modes[nextIndex]); // update mode
  modeBtn.textContent = `Mode: ${getState().mode}`; // update button text

  // if in expert mode, show the expert mode container
  expertModeContainer.style.display =
    getState().mode !== "expert" ? "none" : "block";
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
  if (getState().mode === "expert") {
    checkExpertGuess();
  }

  // generate new round
  const availableArtists = filterArtists();
  setAnswerIndex(roundGenerator(availableArtists, getState().mode, gridItems));
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
  const correctAnswer = getState().currentRoundArtists[getState().answerIndex].name;

  const correct = handleExpertGuess(userGuess, correctAnswer);

  if (correct) {
    addSeenArtist(getState().currentRoundArtists[getState().answerIndex].id);
  }

  // If game over, show screen
  if (getState().lives === 0) {
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
      handleClickGuess(guessIndex, getState().answerIndex);
      addSeenArtist(getState().currentRoundArtists[getState().answerIndex].id);

      // If game over, show screen, else go to next round
      if (getState().lives === 0) {
        handleGameOver();
      } else {
        setTimeout(handleNext, 1000);
      }
    }
  });
});
