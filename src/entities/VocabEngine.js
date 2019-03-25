/**
 * @flow
 */

import type { Venue, VocabEntry } from 'src/entities/Types';

import { fetchVocab } from 'src/async/VocabFetcher';
import {
  cancellablePromise,
  getLevel,
  objectKeysToLowercase,
} from 'src/util/Util';

const categoryToVocab = objectKeysToLowercase(require('data/categories-vocab'));

export const generateKeywordsForVenueCategory = async (
  venuesById: Map<string, Venue>,
  venueId: string
): Promise<Array<string>> => {
  let res = [];
  const venue = venuesById.get(venueId);
  if (!venue) {
    console.error(`Invalid venue id ${venueId}`);
    return res;
  }

  const category = venue.category.toLowerCase();
  console.log('CATEGORY:', category);
  if (typeof categoryToVocab[category] === 'string') {
    res = categoryToVocab[categoryToVocab[category].toLowerCase()].slice();
  } else if (categoryToVocab[category]) {
    res = categoryToVocab[category].slice();
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
