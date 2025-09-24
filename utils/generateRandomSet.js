export function generateRandomSet(length) {
  // create a new set
  const randomSet = new Set();

  while (randomSet.size < 4) {
    // generate a random whole integer
    const randomNum = Math.floor(Math.random() * length);
    // add to the set if it's not already there
    randomSet.add(randomNum);
  }
  return randomSet;
}
