import { generateRandomSet } from "./utils/generateRandomSet.js";

// MVP:
// make database for people with name + image
const options = [
  { name: "Martin Garrix", source: "images/martin_garrix.png", category: "dj" },
  { name: "David Guetta", source: "images/david_guetta.png", category: "dj" },
  { name: "Alok", source: "images/alok.png", category: "dj" },
  { name: "fred again", source: "images/fred_again.png", category: "dj" },
  { name: "timmy trumpet", source: "images/timmy_trumpet.png", category: "dj" },
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

// let user select a category
let category = "dj";

// filter the options we have to make sure we're only pooling from the selected category
let filteredOptions = options.filter((option) => option.category === category);

let answerIndex;
const gridItems = document.querySelectorAll(".grid-item");

//
// round generator
//
function roundGenerator() {
  // generate four random unique numbers using util function
  const randomSet = generateRandomSet(filteredOptions.length);
  // NOTE: Convert Set → Array so we can use index in forEach
  // Set.forEach does NOT provide an index (its callback is (value, valueAgain, set)),
  // so to loop with both value and index (value, index) we need Array.from().
  const randomArray = Array.from(randomSet);

  // randomly select one of these as the "answer"
  answerIndex = randomArray[Math.floor(Math.random() * 4)];
  const answer = filteredOptions[answerIndex];
  console.log("answer", answer);

  // set the question
  const questionElement = document.querySelector(".question");
  questionElement.textContent = `Who is ${answer.name}?`;

  // render the images for the user to guess from

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

//
// guess handler:
//

gridItems.forEach((gridItem) => {
  const img = gridItem.querySelector("img");
  // add an event listener
  img.addEventListener("click", (event) => {
    const guessIndex = parseInt(event.target.dataset.index);
    checkGuess(guessIndex);
  });
});

function checkGuess(guessIndex) {
  console.log("guessIndex: ", guessIndex);
  console.log("answerIndex: ", answerIndex);
  if (guessIndex === answerIndex) {
    console.log("Correct!");
  }
}

// checker:

// - check the answer

// score handler:

// - score and move onto the next question (call round generator)

const nextBtn = document.getElementById("next");

function handleNext() {
  console.log("Next Clicked");
  // score
  // generate round
  roundGenerator();
}

nextBtn.addEventListener("click", handleNext);
