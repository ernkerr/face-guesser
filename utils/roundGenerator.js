import { generateRandomSet } from "./generateRandomSet.js";
import { updateQuestionUI, populateGridUI, resetGrid } from "../ui/renderer.js";

/**
 * Handles one round of the game: generating random options,
 * choosing the correct answer, and updating the UI.
 *
 * @param {Array} filteredOptions - Filtered list of options for the selected category
 * @param {string} mode - Current game mode ("easy" | "normal" | "expert")
 * @returns {number} The answerIndex (so main file can track it)
 */

export function roundGenerator(filteredOptions, mode) {
  // reset round
  resetGrid();

  // generate 4 random unique numbers
  const randomArray = Array.from(generateRandomSet(filteredOptions.length));
  // NOTE: Convert Set -> Array so forEach provides index

  // choose one as the answer
  const answerIndex = randomArray[Math.floor(Math.random() * 4)];
  let answer = filteredOptions[answerIndex];

  // update the question section (text/image)
  updateQuestionUI(answer, mode);
  populateGridUI(randomArray, filteredOptions, mode);

  // return answer index for validation later
  return answerIndex;
}
