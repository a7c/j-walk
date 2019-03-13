/**
 *  @flow
 */

export const PlayMode = Object.freeze({
  /** Player must physically walk around to move the avatar. */
  ROAMING: 'ROAMING',
  /** Player can move the avatar by panning the map. */
  STATIONARY: 'STATIONARY',
});
export type PlayModeType = $Values<typeof PlayMode>;
