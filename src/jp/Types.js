/**
 *  @flow
 */

export const JpDisplayStyle = Object.freeze({
  ROMAJI: 'ROMAJI',
  KANA: 'KANA',
  // NOTE: this is here for completion's sake, but it should not be available
  // for the user study!
  KANJI: 'KANJI',
});
export type JpDisplayStyleType = $Values<typeof JpDisplayStyle>;
