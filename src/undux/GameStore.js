/**
 *  @flow
 */

import type { Venue, VocabEntry } from 'src/entities/Types';
import type { JpDisplayStyleType } from 'src/jp/Types';
import type { Effects, Store } from 'undux';

import { JpDisplayStyle } from 'src/jp/Types';
import { createConnectedStore } from 'undux';

type State = {|
  venuesById: Map<string, Venue>,
  vocabById: Map<string, VocabEntry>,

  // TODO: will need to cache these when we do word associations
  //keywordsFromVenueCategory: Map<string, Array<string>>
  vocabFromKeyword: Map<string, Array<string>>, // keyword -> vocab ids

  learnedVocab: Set<string>, // vocab ids
  nearbyVenues: Set<string>, // venue ids

  jpDisplayStyle: JpDisplayStyleType,
|};

const initialState: State = {
  venuesById: new Map(),
  vocabById: new Map(),

  vocabFromKeyword: new Map(),

  learnedVocab: new Set(),
  nearbyVenues: new Set(),

  jpDisplayStyle: JpDisplayStyle.KANA,
};

const { withStore, Container } = createConnectedStore(initialState);

export { withStore, Container };

export type GameStoreProps = {|
  store: Store<State>,
|};
