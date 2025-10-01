import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.js";

import { generateRandomSet } from "./utils/generateRandomSet.js";
import { initAnimations, playAnimation } from "./animations.js";

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

const titleScreen = document.getElementById("title-screen");
const startBtn = document.getElementById("start-btn");
let modeBtn = document.getElementById("mode-btn");

// ======= GAME SCREEN =======

const gameScreen = document.getElementById("game-screen");
gameScreen.style.display = "none";

startBtn.addEventListener("click", () => {
  setTimeout(() => {
    titleScreen.style.display = "none"; // hide title screen
    gameScreen.style.display = "block"; // show game screen
    gameScreen.style.opacity = 1;
    roundGenerator(); // start first round
  }, 500); // match the CSS transition time
});

const scoreDisplay = document.getElementById("score");
const gridItems = document.querySelectorAll(".grid-item");
const nextBtn = document.getElementById("next");
let score = 0;
let rounds = 0;
let answerIndex;

// ======= MODE =======

const modes = ["easy", "normal", "expert"];
let mode = "normal";
modeBtn.textContent = `Mode: ${mode}`; // initialize mode text
modeBtn.addEventListener("click", switchMode);

// hide input + next button by default
const expertModeContainer = document.getElementById("expert-mode");
expertModeContainer.style.display = "none";

function switchMode() {
  const currentIndex = modes.indexOf(mode); // get the current mode's index
  const nextIndex = (currentIndex + 1) % modes.length; // get next index (wraps back to 0)
  mode = modes[nextIndex]; // update mode
  modeBtn.textContent = `Mode: ${mode}`; // update button text

  // if in expert mode, show the expert mode container
  expertModeContainer.style.display = mode !== "expert" ? "none" : "block";
}

// ======= CATEGORY =======
// let categoryTitle = category.toUpperCase();
// document.getElementById("category").textContent = `${categoryTitle}`;
// P2: let user select a category (must be logged in error toast)
// if they are logged in then they can switch the category like they can switch the mode
// get that user's category: artist, rapper,  country singer, etc.

let category = "dj";
let filteredOptions = options.filter((option) => option.category === category); // filter for the selected category

// ======= ROUND GENERATOR =======

function roundGenerator() {
  // reset round
  enableGuesses();
  gridItems.forEach((item) => item.classList.remove("correct-answer"));

  // generate 4 random unique numbers
  const randomArray = Array.from(generateRandomSet(filteredOptions.length));
  // NOTE: Convert Set → Array so we can use index in forEach
  // Set.forEach does NOT provide an index (its callback is (value, valueAgain, set)),
  // so to loop with both value and index (value, index) we need Array.from().

  // choose one as the "answer"
  answerIndex = randomArray[Math.floor(Math.random() * 4)];
  const answer = filteredOptions[answerIndex];

  // set the question
  const questionText = document.querySelector(".question-text");
  const questionImg = document.getElementById("question-img");

  if (mode === "easy") {
    // Show text only
    questionText.textContent = `Who is ${answer.name}?`;
    questionImg.style.display = "none"; // hide image
  } else {
    // Show text + image
    questionText.textContent = `Who is this?`;
    questionImg.src = answer.source;
    questionImg.style.display = "block"; // show image
  }

  // Loop over the array of random indices for this round
  // optionIndex represents these values at each loop ex: [3, 0, 4, 2]
  // i represents the position in the grid (0, 1, 2, 3)
  randomArray.forEach((optionIndex, i) => {
    // Get the <img> element inside the corresponding grid item
    // gridItems[i] is the <div class="grid-item"> at position i
    const img = gridItems[i].querySelector("img");
    const name = gridItems[i].querySelector("p");

    const option = filteredOptions[optionIndex];

    if (mode === "easy") {
      // set the image src to the URL found in the filteredOptions array at optionIndex
      img.setAttribute("src", option.source);
      img.classList.add("secondary-button-img");
      // store the index of this img as a data atribute on the <img>
      img.dataset.index = optionIndex; // store index for clicks
      name.style.display = "none";
    } else if (mode === "normal") {
      name.textContent = `${option.name}`;
      name.dataset.index = optionIndex; // store index for clicks
      img.classList.remove("secondary-button-img");
    } else {
      name.style.display = "none";
      img.classList.remove("secondary-button-img");
    }
  });
}

// ======= GUESS HANDLER =======

function checkGuess(guessIndex) {
  if (guessIndex === answerIndex) {
    playAnimation("correct");
    disableGuesses();
    console.log("Correct!");
    updateScore(10);

    setTimeout(handleNext, 1000);
  } else {
    playAnimation("incorrect");
    disableGuesses();
    setTimeout(handleNext, 1000);
  }
}

// different logic in expert mode

function checkExpertGuess() {
  const guessElement = document.getElementById("guess-input");
  const guess = guessElement.value.trim().toUpperCase();
  const answer = filteredOptions[answerIndex].name.trim().toUpperCase();

  // calculate a “fuzzy match score”
  const fuse = new Fuse([{ name: answer }], {
    keys: ["name"], // what property to search in
    threshold: 0.4, // lower = stricter match, higher = fuzzier
    ignoreLocation: true, // ignore position of match
    minMatchCharLength: 1,
    includeScore: true,
  });
  // runs the search will return a number from 0 - 1
  const results = fuse.search(guess);
  console.log("Results", results);

  // Default fuzzyScore = 0 if no match
  let fuzzyScore = 0;
  if (results.length > 0 && typeof results[0].score === "number") {
    fuzzyScore = 1 - results[0].score;
    console.log("Fuzzy Score:", fuzzyScore.toFixed(2));
  }

  const threshold = 0.7;
  const minLengthRatio = 0.7; // must match at least 50% of the correct name length

  if (
    fuzzyScore >= threshold &&
    guess.length / answer.length >= minLengthRatio
  ) {
    console.log("✅ Correct! Guess:", guess, "Answer:", answer);
    playAnimation("correct");
    updateScore(10);
  } else {
    console.log("❌ Incorrect. Guess:", guess, "Answer:", answer);
    playAnimation("incorrect");
  }

  // reset input for the next round
  guessElement.value = "";
  // alt if fuzzy search doesn't work very well
  // Levenshtein Distance Algorithm
  // Jaro-Winkler Distance
  // Soundex and Metaphone Algorithms
}

// ======= SCORE HANDLER =======

function updateScore(points) {
  score += points;

  // animation
  scoreDisplay.classList.remove("gelatine"); // reset
  void scoreDisplay.offsetWidth; // force reflow (hack so browser sees the removal)
  scoreDisplay.classList.add("gelatine"); // re-add so animation runs again

  scoreDisplay.textContent = score;
}

// ======= NEXT ROUND =======

function handleNext() {
  console.log("Next Clicked");
  // handle guess for expert mode
  if (mode === "expert") {
    checkExpertGuess();
  }
  rounds += 1;
  roundGenerator();
}

nextBtn.addEventListener("click", handleNext);

// ======= CLICK CONTROL =======
function disableGuesses() {
  gridItems.forEach((gridItem) => {
    const img = gridItem.querySelector("img");
    img.style.pointerEvents = "none"; // block clicks
  });
}

function enableGuesses() {
  gridItems.forEach((gridItem) => {
    const img = gridItem.querySelector("img");
    img.style.pointerEvents = "auto"; // allow clicks
  });
}

// ======= INITIALIZATION =======

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

      // run your guess check logic
      checkGuess(guessIndex);
    }
  });
});

// ======= P2 =======
// Allow people to login with spotify
// categories (user's genres)

// “Who’s this?” style AR/Instagram/TikTok effect, where a DJ or celebrity’s image hovers over someone’s forehead while they record themselves reacting
// Webcam video feed – get live camera input from the user.
// Face detection / tracking – figure out where the forehead is so you can place the image correctly.
// Overlay image – show the DJ/celebrity image “on top” of the person’s forehead.
// Optional: record the video and allow sharing to social media.
