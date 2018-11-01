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
    if (this._venue.state === VenueState.HIDDEN) {
      return null;
    }

    const imageIndex = parseInt(this.props.venueId, 16) % sushiIcons.length;

    const width = 64;
    const height = 64;

    return (
      // TODO: replace with image
      <MapView.Marker
        coordinate={{
          latitude: this._venue.lat,
          longitude: this._venue.lng,
        }}
        calloutOffset={{ x: -1, y: 28 }}
      >
        <Image
          source={sushiIcons[imageIndex]}
          resizeMode={Image.resizeMode.cover}
          style={{
            width,
            height,
            zIndex: 0,
          }}
        />
        <VenueCallout venueId={this.props.venueId} />
      </MapView.Marker>
    );
  }
}

export default withStore(VenueMarker);
