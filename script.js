// Title Screen

import { generateRandomSet } from "./utils/generateRandomSet.js";
import { initAnimations, playAnimation } from "./animations.js";

await initAnimations(); // preload JSONs

// MVP:
// make database for people with name + image
const options = [
  { name: "Martin Garrix", source: "images/martin_garrix.png", category: "dj" },
  { name: "David Guetta", source: "images/david_guetta.png", category: "dj" },
  { name: "    Alok   ", source: "images/alok.png", category: "dj" },
  { name: "Fred Again", source: "images/fred_again.png", category: "dj" },
  { name: "Timmy Trumpet", source: "images/timmy_trumpet.png", category: "dj" },
];

// title screen

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
    // Start first round
    roundGenerator();
  }, 500); // match the CSS transition time
});

const scoreDisplay = document.getElementById("score");
const questionElement = document.querySelector(".question");
const gridItems = document.querySelectorAll(".grid-item");
const nextBtn = document.getElementById("next");
let score = 0;
let rounds = 0;
let answerIndex;

// ======= MODE =======

const expertModeContainer = document.getElementById("expert-mode");

const modes = ["easy", "normal", "expert"];
let mode = "normal";

// initialize mode text
modeBtn.textContent = `Mode: ${mode}`;

// hide input + next button by defaultv
expertModeContainer.style.display = "none";
nextBtn.style.display = "none";

modeBtn.addEventListener("click", switchMode);

function switchMode() {
  // get the current mode's index
  const currentIndex = modes.indexOf(mode);

  // get next index (wraps back to 0)
  const nextIndex = (currentIndex + 1) % modes.length;

  // update mode
  mode = modes[nextIndex];
  // update button text
  modeBtn.textContent = `Mode: ${mode}`;
  //  log it
  console.log("Mode switched to:", mode);

  if (mode !== "expert") {
    expertModeContainer.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    expertModeContainer.style.display = "block";
    nextBtn.style.display = "block";
  }
}

// // the input & next btn should be hidden by default unless it's expert mode, then it should be visible
// document.getElementById("expert-mode").style.display = "none";
// nextBtn.style.display = "none";

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
  // reset
  enableGuesses();
  gridItems.forEach((item) => item.classList.remove("correct-answer"));

  // Generate 4 random unique numbers
  const randomArray = Array.from(generateRandomSet(filteredOptions.length));
  // NOTE: Convert Set → Array so we can use index in forEach
  // Set.forEach does NOT provide an index (its callback is (value, valueAgain, set)),
  // so to loop with both value and index (value, index) we need Array.from().

  // Choose one as the "answer"
  answerIndex = randomArray[Math.floor(Math.random() * 4)];
  const answer = filteredOptions[answerIndex];

  // Set the question
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
  // else {
  //   // show image + input
  // }

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

    // console.log("Option index", optionIndex);
  });
}

// ======= GUESS HANDLER =======

function checkGuess(guessIndex) {
  //   console.log("guessIndex: ", guessIndex);
  //   console.log("answerIndex: ", answerIndex);

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

// <input type="text" id="guess-input" />;
function checkExpertGuess() {
  let guess = document.getElementById("guess-input");
  let answer = filteredOptions[answerIndex].name;
  if (guess === answer) {
  }
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
