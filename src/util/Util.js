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

export type CancellablePromise<T> = {|
  promise: Promise<T>,
  cancel: void => boolean,
|};

/**
 * Wrapper for promises that allows them to be cancelled (e.g. on component
 * unmount).
 *
 * Source: https://medium.com/trabe/avoid-updates-on-unmounted-react-components-2fbadab17ad2
 */
export const cancellablePromise = <T>(
  promise: Promise<T>
): CancellablePromise<T> => {
  let hasCancelled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      value =>
        hasCancelled ? reject({ isCancelled: true, value }) : resolve(value),
      error => reject({ isCancelled: hasCancelled, error })
    );
  });

  return {
    promise: wrappedPromise,
    cancel: () => (hasCancelled = true),
  };
};

/**
 * Returns the total exp needed to level up to the next level.
 */
export const getTotalExpTnl = (level: number): number => {
  return Math.pow(level, 2) + level * 14;
};

/**
 * Given the player's cumulative exp, returns the player's level and
 * residual exp.
 */
export const getLevelAndExp = (exp: number): [number, number] => {
  let level = 0;
  while (exp >= 0) {
    level++;
    exp -= getTotalExpTnl(level);
  }
  return [level, getTotalExpTnl(level) + exp];
};

export const actionToId = (action) => {
  switch (action) {
    case playerActions.LEARN_VOCAB: return 1;
    case playerActions.LEARN_VOCAB_FROM_VENUE: return 2;
    case playerActions.REVIEW_VOCAB: return 3;
    case playerActions.PASS_CHALLENGE: return 4;
    case playerActions.COMPLETE_SENTENCE: return 5;
    case playerActions.GAIN_EXP: return 6;
    case "LEVEL_UP": return 7;
    case "TRACK_POSITION": return 8;
    case "REVIEW_WRONG": return 9;
    case mapActions.ATTACH_VOCAB_TO_VENUE: return 10;
    case mapActions.SET_VENUE_TO_CHALLENGE: return 11;
    case "JP_DISPLAY_STYLE": return 12;
    default: return 0;
  }
}
