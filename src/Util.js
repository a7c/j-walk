/**
 * @flow
 */

/**
 * Randomize array element order in-place in O(n).
 * Using Durstenfeld shuffle algorithm.
 *
 * Source: http://stackoverflow.com/a/12646864
 */
export function shuffleArray<T>(array: Array<T>): Array<T> {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 * Returns a random integer between min and max (inclusive).
 */
export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
