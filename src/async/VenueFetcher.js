/**
 * @flow
 */

import type { Venue } from 'src/entities/Types';

import Config from 'root/config.json';
import { VenueState } from 'src/entities/Types';

type FoursquareCategory = {
  name: string,
  shortName: string,
};
type FoursquareVenue = {
  id: string,
  name: string,
  location: {
    lat: number,
    lng: number,
  },
  categories: Array<FoursquareCategory>,
};
type FoursquareResponse = {
  response: {
    venues: Array<FoursquareVenue>,
  },
};

export const fetchVenues = async (
  lat: number,
  lng: number,
  radius: number
): Promise<Array<Venue>> => {
  const apiUrl = 'https://api.foursquare.com/v2/venues/search?';
  const clientId = Config.foursquareClientId;
  const clientSecret = Config.foursquareClientSecret;
  const version = '20170306';

  try {
    const response = await fetch(
      `${apiUrl}intent=browse&radius=${radius}&ll=${lat},${lng}&limit=8&client_id=${clientId}&client_secret=${clientSecret}&v=${version}`
    );
    const responseJson: FoursquareResponse = await response.json();
    const venues: Array<Venue> = responseJson.response.venues.reduce(
      (acc, venueData) => {
        const venue = _processVenue(venueData);
        if (venue) {
          acc.push(venue);
        }
        return acc;
      },
      []
    );
    return venues;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const _processVenue = (venueData: FoursquareVenue): ?Venue => {
  if (!venueData.categories || venueData.categories.length === 0) {
    return null;
  }
  const venue: Venue = {
    id: venueData.id,
    name: venueData.name,
    lat: venueData.location.lat,
    lng: venueData.location.lng,
    category: venueData.categories[0].shortName.toLowerCase(),
    state: VenueState.HIDDEN,
    vocab: null,
    sentence: null,
    anchorWord: null,
    testWordId: null,
  };
  return venue;
};
