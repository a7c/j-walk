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
  playerID: ?string,
|};

const initialState: State = {
  venuesById: new Map(),
  // vocabById: new Map(),
  // TODO: this is test data
  // https://github.com/facebook/flow/issues/2221
  // $FlowExpectedError: this is really hard to type, so don't bother lol
  vocabById: new Map(
    Object.entries({
      私: {
        id: '私',
        word: '私',
        reading: 'watashi',
        english: 'I; me',
      },
      美味しい: {
        id: '美味しい',
        word: '美味しい',
        reading: 'oishii',
        english: 'tasty',
      },
      彼女: {
        id: '彼女',
        word: '彼女',
        reading: 'kanojo',
        english: 'she; her',
      },
      走る: {
        id: '走る',
        word: '走る',
        reading: 'hashiru',
        english: 'to run',
      },
    })
  ),

  vocabFromKeyword: new Map(),

  // learnedVocab: new Set(),
  // TODO: this is test data
  learnedVocab: new Set(['私', '美味しい', '彼女', '走る']),

  nearbyVenues: new Set(),

  jpDisplayStyle: JpDisplayStyle.KANA,
  playerID: '',
};

const { withStore, Container } = createConnectedStore(initialState);

export { withStore, Container };

export type GameStoreProps = {|
  store: Store<State>,
|};
