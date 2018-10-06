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
|};

export type VocabEntry = {|
  id: string,
  word: string,
  reading: string,
  english: string,
|};
