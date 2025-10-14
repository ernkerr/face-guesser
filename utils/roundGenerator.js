import { generateRandomSet } from "./generateRandomSet.js";

/**
 * Handles one round of the game: generating random options,
 * choosing the correct answer, and updating the UI.
 *
 * @param {Array} filteredOptions - Filtered list of options for the selected category
 * @param {string} mode - Current game mode ("easy" | "normal" | "expert")
 * @param {NodeList} gridItems - The 4 clickable grid items
 * @returns {number} The answerIndex (so main file can track it)
 */

export function roundGenerator(filteredOptions, mode, gridItems) {
  // reset round
  gridItems.forEach((item) => item.classList.remove("correct-answer"));
  gridItems.forEach((gridItem) => {
    const img = gridItem.querySelector("img");
    img.style.pointerEvents = "auto"; // enable guesses again
  });

  // generate 4 random unique numbers
  const randomArray = Array.from(generateRandomSet(filteredOptions.length));
  // NOTE: Convert Set -> Array so forEach provides index

  // choose one as the answer
  const answerIndex = randomArray[Math.floor(Math.random() * 4)];
  let answer = filteredOptions[answerIndex];

  // update the question section (text/image)
  updateQuestionUI(answer, mode);
  populateGridUI(randomArray, filteredOptions, mode, gridItems);

  // return answer index for validation later
  return answerIndex;
}

/**
 * Updates the question area (text + image) based on mode
 */
function updateQuestionUI(answer, mode) {
  const questionText = document.querySelector(".question-text");
  const questionImg = document.getElementById("question-img");

  if (mode === "easy") {
    // Show text only
    questionText.textContent = `Who is ${answer.name}?`;
    questionImg.style.display = "none"; // hide image
  } else {
    // Show text + image
    questionText.textContent = `Who is this?`;
    questionImg.src = answer.images[0].url;
    questionImg.style.display = "block"; // show image
  }
}

/**
 * Populates each grid tile with image and/or text based on mode
 */
function populateGridUI(randomArray, filteredOptions, mode, gridItems) {
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
      console.log("option: ", option);
      img.setAttribute("src", option.images[0].url);
      img.classList.add("secondary-button-img");
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
