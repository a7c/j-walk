/**
 * @flow
 */

import type { Venue } from 'src/entities/Types';
import type { GameStoreProps } from 'src/undux/GameStore';

import { MapView } from 'expo';
import React from 'react';
import { Image } from 'react-native';

import { VenueState } from 'src/entities/Types';
import VenueCallout from 'src/components/map/VenueCallout';
import { withStore } from 'src/undux/GameStore';

const sushiIcons = [
  require('assets/images/icons/sushi1.png'),
  require('assets/images/icons/sushi2.png'),
  require('assets/images/icons/sushi3.png'),
  require('assets/images/icons/sushi4.png'),
  require('assets/images/icons/sushi5.png'),
];

type Props = {|
  ...GameStoreProps,
  /** Whether the venue is in range for the player to interact with */
  inRange: boolean,
  venueId: string,
|};

type State = {||};

class VenueMarker extends React.Component<Props, State> {
  _venue: Venue;

  constructor(props: Props) {
    super(props);
    const { store, venueId } = props;

    const venue: ?Venue = store.get('venuesById').get(venueId);
    if (venue) {
      this._venue = venue;
    } else {
      throw new Error(
        `Tried to init VenueMarker with invalid venue id ${venueId}`
      );
    }
  }

  render() {
    const { inRange, venueId } = this.props;

    if (this._venue.state === VenueState.HIDDEN) {
      return null;
    }

    const imageIndex = parseInt(venueId, 16) % sushiIcons.length;

    // make marker larger as an indication that it's in range
    const width = inRange ? 96 : 64;
    const height = inRange ? 96 : 64;

    return (
      <MapView.Marker
        coordinate={{
          latitude: this._venue.lat,
          longitude: this._venue.lng,
        }}
        calloutOffset={{ x: -1, y: 28 }}
        stopPropagation={true}
      >
        <Image
          source={sushiIcons[imageIndex]}
          resizeMode={Image.resizeMode.cover}
          style={{
            width,
            height,
          }}
        />
        <VenueCallout canInteract={inRange} venueId={venueId} />
      </MapView.Marker>
    );
  }
}

export default withStore(VenueMarker);
