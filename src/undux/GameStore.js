/**
 *  @flow
 */

import type { Venue } from 'src/entities/Types';
import type { Effects, Store } from 'undux';

import { createConnectedStore } from 'undux';

type State = {|
  venuesById: Map<string, Venue>,

  nearbyVenues: Array<string>, // venue ids
|};

const initialState: State = {
  venuesById: new Map(),

  nearbyVenues: [],
};

const { withStore, Container } = createConnectedStore(initialState);

export { withStore, Container };

export type GameStoreProps = {|
  store: Store<State>,
|};
