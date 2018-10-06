/**
 * @flow
 */

import { fetchVocab } from 'src/async/VocabFetcher';
import type { Venue, VocabEntry } from 'src/entities/Types';

export const generateKeywordsForVenueCategory = async (
  venuesById: Map<string, Venue>,
  venueId: string
): Promise<Array<string>> => {
  const res = [];
  const venue = venuesById.get(venueId);
  if (!venue) {
    console.error(`Invalid venue id ${venueId}`);
    return res;
  }
  res.push(venue.category);
  if (venue.category.includes(' ')) {
    venue.category.split(' ').forEach(word => res.push(word));
  }
  // console.log(res);

  // TODO: word associations
  return res;
};

export const generateVocabForKeyword = fetchVocab;
