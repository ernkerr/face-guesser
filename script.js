import { generateRandomSet } from "./utils/generateRandomSet.js";

// MVP:
// make database for people with name + image
const options = [
  { name: "MartinGarrix", source: "images/martin_garrix.png", category: "dj" },
  { name: "David Guetta", source: "images/david_guetta.png", category: "dj" },
  { name: "Alok", source: "images/alok.png", category: "dj" },
  { name: "fred_again", source: "images/fred_again.png", category: "dj" },
  { name: "timmy_trumpet", source: "images/timmy_trumpet.png", category: "dj" },
];

//
// round generator
//

function roundGenerator(category) {
  // get 4 random djs
  // filter the options we have to make sure we're only pooling from the selected category

  // note:
  // arrow function are normally like this:
  // const functionName = (parameters) => {code block};
  //
  // but since we are automatically (implicitly) returning the result
  // const functionName = (parameters) => expression;

  const filteredOptions = options.filter(
    (option) => option.category === category
  );

  // generate four random unique numbers
  let randomSet = generateRandomSet(filteredOptions.length);

  console.log("Random set", randomSet);

  randomSet.forEach(function (index) {
    console.log(index);
  });

  const gridItems = document.querySelectorAll(".grid-item");

  //   {0, 3, 1, 2}

  //   document.getElementByClass("grid-item").setAttribute("src");

  // .addEventListener("click", checkGuess)

  //   document.getElementById("grid-item").setAttribute("src", "newImage.jpg");

  // from these pick one to be the "winner"
  // then display the "Winner's name"
  // send the winner to the
}

// - question generator (pick 1 DJ for the name and image, get 3 other images for distractors)
// - render UI

// guess handler:

// - let the user guess

// checker:

// - check the answer

// score handler:

// - score and move onto the next question (call round generator)

const nextBtn = document.getElementById("next");

function handleNext() {
  console.log("Next Clicked");
  let category = "dj";
  // score
  // generate round
  roundGenerator(category);
}

nextBtn.addEventListener("click", handleNext);
