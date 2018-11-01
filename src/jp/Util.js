/**
 *  @flow
 */

import type { JpDisplayStyleType } from 'src/jp/Types';

import { JpDisplayStyle } from 'src/jp/Types';
import { toRomaji } from 'wanakana';

/** Returns a function that formats Japanese text based on the
 *  player's Japanese display style setting.
 *
 *  NOTE: currently assumes that no kanji will be passed in. it
 *  would be nice if this could convert kanji -> kana/romaji too.
 */
export const makeJpFormatter = (
  displayStyle: JpDisplayStyleType
): (string => string) => {
  return (jp: string) => {
    switch (displayStyle) {
      case JpDisplayStyle.KANJI:
      case JpDisplayStyle.KANA:
        return jp;
      case JpDisplayStyle.ROMAJI:
        return toRomaji(jp);
      default:
        throw new Error(`Unrecognized Japanese display style ${displayStyle}`);
    }
  };
};
