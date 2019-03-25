/*
 * @flow
 */

import type { PlayModeType } from 'src/util/Types';

import { MapView } from 'expo';
import React from 'react';
import { Image } from 'react-native';

import { PlayMode } from 'src/util/Types';
import { getLevel } from 'src/util/Util';

type Props = {|
  playerExp: number,
  playMode: PlayModeType,
  position: {
    latitude: number,
    longitude: number,
  },
  heading: number,
  region: {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  },
|};

// TODO: factor this out
const _getInteractRadius = (playerExp: number) => {
  return 50 + 5 * getLevel(playerExp);
};

const AvatarMarker = (props: Props) => {
  return (
    <React.Fragment>
      {/* TODO: this is a terrible hack that works around an apparent glitch
        * in react-native-maps that breaks markers when two markers (a venue
        * and the player) overlap. */}
      <MapView.Overlay
        image={require('assets/images/map/mon.png')}
        bounds={[
          [
            props.position.latitude - 0.0425 * props.region.latitudeDelta,
            props.position.longitude - 0.08 * props.region.longitudeDelta,
          ],
          [
            props.position.latitude + 0.0425 * props.region.latitudeDelta,
            props.position.longitude + 0.08 * props.region.longitudeDelta,
          ],
        ]}
      />
      {/*}<MapView.Marker
        coordinate={props.position}
        pointerEvents="none"
        style={{
          zIndex: 0,
        }}
        stopPropagation={true}
      >
        <Image
          source={require('assets/images/map/mon.png')}
          resizeMode={Image.resizeMode.cover}
          style={{
            width: 47,
            height: 40,
            left: 100,
            position: 'absolute',
          }}
        />
        {
          //props.playMode === PlayMode.ROAMING ? (
          <Image
            source={require('assets/images/map/bearingV3.png')}
            resizeMode={Image.resizeMode.cover}
            style={{
              width: 90,
              height: 90,
              position: 'absolute',
              top: -24,
              left: -21,
              transform: [{ rotate: String(props.heading) + 'deg' }],
            }}
          />
          //) : null
        }
      </MapView.Marker>*/}
      <MapView.Circle
        // workaround to make the circle re-render when the position updates
        // source: https://github.com/react-community/react-native-maps/issues/283#issuecomment-227812817
        key={(props.position.latitude + props.position.longitude).toString()}
        center={props.position}
        radius={_getInteractRadius(props.playerExp)}
        strokeColor={'#00cccc80'}
        strokeWidth={2}
        fillColor={'#00ffff20'}
      />
    </React.Fragment>
  );
};

export default AvatarMarker;
