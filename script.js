import { generateRandomSet } from "./utils/generateRandomSet.js";

// MVP:
// make database for people with name + image
const options = [
  { name: "Martin Garrix", source: "images/martin_garrix.png", category: "dj" },
  { name: "David Guetta", source: "images/david_guetta.png", category: "dj" },
  { name: "Alok", source: "images/alok.png", category: "dj" },
  { name: "Fred Again", source: "images/fred_again.png", category: "dj" },
  { name: "Timmy Trumpet", source: "images/timmy_trumpet.png", category: "dj" },
];
// John Summit
// Dom Dolla
// Mau P
// Sarah Landry
// Illenium
// Subtronics
// Excision
// Disco Lines
// KAYTRANADA
// Skrillex
// Flume
// Chainsmokers
// Green Velvet
// Gryffin
// Rezz
// Tiesto
// Pasquale
// Dillon Francis
// Allison Wonderland

// Rufus Du Sol

let score = 0;
let rounds = 0;
let answerIndex;

// TODO:
let mode = "easy";

// TODO: let user select a category
let category = "dj";

let filteredOptions = options.filter((option) => option.category === category); // filter for the selected category
const gridItems = document.querySelectorAll(".grid-item");
const scoreDisplay = document.getElementById("score");
const questionElement = document.querySelector(".question");
const nextBtn = document.getElementById("next");

// ======= ROUND GENERATOR =======

function roundGenerator() {
  // Reset highlights
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
  const questionElement = document.querySelector(".question");
  questionElement.textContent = `Who is ${answer.name}?`;

  // Loop over the array of random indices for this round
  // optionIndex represents these values at each loop ex: [3, 0, 4, 2]
  // i represents the position in the grid (0, 1, 2, 3)
  randomArray.forEach((optionIndex, i) => {
    // Get the <img> element inside the corresponding grid item
    // gridItems[i] is the <div class="grid-item"> at position i
    const img = gridItems[i].querySelector("img");

    // set the image src to the URL found in the filteredOptions array at optionIndex
    img.setAttribute("src", filteredOptions[optionIndex].source);

    // store the index of this img as a data atribute on the <img>
    img.dataset.index = optionIndex; // store index for clicks
    console.log("Option index", optionIndex);
  });
}

// ======= GUESS HANDLER =======

function checkGuess(guessIndex) {
  console.log("guessIndex: ", guessIndex);
  console.log("answerIndex: ", answerIndex);

  if (guessIndex === answerIndex) {
    console.log("Correct!");
    updateScore(10);

    // setTimeout(handleNext, 1500);
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
  rounds += 1;
  roundGenerator();
}

nextBtn.addEventListener("click", handleNext);

// ======= INITIALIZATION =======

gridItems.forEach((gridItem) => {
  const img = gridItem.querySelector("img");
  // add an event listener
  img.addEventListener("click", (event) => {
    // bounce animation
    img.classList.remove("gelatine"); // reset
    void img.offsetWidth; // force reflow (hack so browser sees the removal)
    img.classList.add("gelatine"); // re-add so animation runs again

    const guessIndex = parseInt(event.target.dataset.index);
    checkGuess(guessIndex);
  });
});

// Start first round
roundGenerator();
