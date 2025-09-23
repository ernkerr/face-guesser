// MVP:
// make database for people with name + image
const options = [
  { name: "MartinGarrix", source: "images/martin_garrix.png", category: "dj" },
  { name: "David Guetta", source: "images/david_guetta.png", category: "dj" },
  { name: "Alok", source: "images/alok.png", category: "dj" },
  { name: "fred_again", source: "images/fred_again.png", category: "dj" },
  { name: "timmy_trumpet", source: "images/timmy_trumpet.png", category: "dj" },
];

function generateRandomNums(length) {
  const randomNums = new Set();

  while (randomNums.size < 4) {
    // generate a random whole integer
    let randomInt = Math.floor(Math.random() * length);
    // add to the set if it's not already there
    randomNums.add(randomInt);
  }
  return randomNums;
}

// round generator:
function roundGenerator(category) {
  // get 4 random djs
  const filteredOptions = options.filter(function (option) {
    return option.category === category;
  });

  //   console.log(filteredOptions);

  let randomSet = generateRandomNums(filteredOptions.length);

  console.log("Random Set", randomSet);

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
  let category = "dj";
  // score
  // generate round
  roundGenerator(category);
}

nextBtn.addEventListener("click", handleNext);
