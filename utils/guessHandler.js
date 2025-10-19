import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.js";
import { updateScore, removeLife, getState } from "../state/store.js";
import { playAnimation } from "../ui/animations.js";

/**
 * Handles a click guess in normal/easy mode.
 *
 * @param {number} guessIndex - The index of the clicked guess.
 * @param {number} answerIndex - The index of the correct answer.
 * @param {Function} handleNext - Function to move to the next round.
 * @param {Function} handleGameOver - Function to show the game over screen.
 * @param {Function} disableGuesses - Function to disable clicking on guesses.
 */
export function handleClickGuess(guessIndex, answerIndex) {
  if (guessIndex === answerIndex) {
    updateScore(10); // updates gameState
    playAnimation("correct");
    return true;
  } else {
    removeLife();
    playAnimation("incorrect");
    return false;
  }
}

/**
 * Handles an expert mode guess using fuzzy matching
 */
export function handleExpertGuess(userGuess, correctAnswer) {
  const guess = userGuess.trim().toUpperCase();
  const answer = correctAnswer.trim().toUpperCase();

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

  // Default fuzzyScore = 0 if no match
  let fuzzyScore = 0;
  if (results.length > 0 && typeof results[0].score === "number") {
    fuzzyScore = 1 - results[0].score;
  }

  const threshold = 0.7;
  const minLengthRatio = 0.7; // must match at least 50% of the correct name length

  if (
    fuzzyScore >= threshold &&
    guess.length / answer.length >= minLengthRatio
  ) {
    updateScore(10);
    playAnimation("correct");
    return true;
  } else {
    removeLife();
    playAnimation("incorrect");
    return false;
  }
}
// alt if fuzzy search doesn't work very well
// Levenshtein Distance Algorithm
// Jaro-Winkler Distance
// Soundex and Metaphone Algorithms");
