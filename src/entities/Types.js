/**
 * @flow
 */

export const VenueState = Object.freeze({
  HIDDEN: 'HIDDEN',
  LOCKED: 'LOCKED',
  LEARN: 'LEARN',
});
export type VenueStateType = $Values<typeof VenueState>;

export type Venue = {|
  id: string,
  name: string,
  lat: number,
  lng: number,
  category: string,
  state: VenueStateType,
  vocab: ?string, // vocab id

  // for challenges
  sentence: ?{
    english: string,
    japanese: string,
  },
  // A word in the sentence that the player has already learned
  anchorWord: ?string,
  // The ID of a word in the sentence that is located at a nearby venue
  testWordId: ?string,
|};

export type VocabEntry = {|
  id: string,
  word: string,
  reading: string,
  english: string,
|};
