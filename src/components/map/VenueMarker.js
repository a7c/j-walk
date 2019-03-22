/**
 * @flow
 */

import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationStateRoute,
} from 'react-navigation';
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

const HOUSE_LOCKED_ICON = require('assets/images/icons/house_locked.png');

type Props = {|
  ...GameStoreProps,
  navigation: NavigationScreenProp<NavigationStateRoute>,
  /** Whether the venue is in range for the player to interact with */
  inRange: boolean,
  venueId: string,
|};

type State = {||};

class VenueMarker extends React.Component<Props, State> {
  _marker: ?MapView.Marker = null;
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

  _hideCallout = () => {
    if (this._marker) {
      this._marker.hideCallout();
    }
  };

  render() {
    const { inRange, venueId } = this.props;

    let src = null;
    switch (this._venue.state) {
      case VenueState.HIDDEN:
        return null;
      case VenueState.LEARN:
        const imageIndex = parseInt(venueId, 16) % sushiIcons.length;
        src = sushiIcons[imageIndex];
        break;
      case VenueState.LOCKED:
        src = HOUSE_LOCKED_ICON;
        break;
    }

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
        ref={marker => (this._marker = marker)}
      >
        <Image
          source={src}
          resizeMode={Image.resizeMode.cover}
          style={{
            width,
            height,
          }}
        />
        <VenueCallout
          navigation={this.props.navigation}
          canInteract={inRange}
          hideCallout={this._hideCallout}
          venueId={venueId}
        />
      </MapView.Marker>
    );
  }
}

export default withStore(VenueMarker);
