/*
 * @flow
 */

import type { JpDisplayStyleType } from 'src/jp/Types';

import getLogging from 'src/logging/Logging';

export const LogAction = Object.freeze({
  LEARN_VOCAB: 1,
  LEARN_VOCAB_FROM_VENUE: 2,
  REVIEW_VOCAB: 3,
  PASS_CHALLENGE: 4,
  COMPLETE_SENTENCE: 5,
  GAIN_EXP: 6,
  LEVEL_UP: 7,
  TRACK_POSITION: 8,
  REVIEW_WRONG: 9,
  ATTACH_VOCAB_TO_VENUE: 10,
  SET_VENUE_TO_CHALLENGE: 11,
  JP_DISPLAY_STYLE: 12,
});

export const logLearnVocab = (vocabId: string) => {
  const logger = getLogging();
  logger.recordEvent(LogAction.LEARN_VOCAB, vocabId);
};

export const logLearnVocabFromVenue = (vocabId: string, venueId: string) => {
  const logger = getLogging();
  logger.recordEvent(LogAction.LEARN_VOCAB_FROM_VENUE, `${vocabId};${venueId}`);
};

export const logReviewVocab = (vocabId: string) => {
  const logger = getLogging();
  logger.recordEvent(LogAction.REVIEW_VOCAB, vocabId);
};

export const logPassChallenge = (vocabId: string, venueId: string) => {
  const logger = getLogging();
  logger.recordEvent(LogAction.PASS_CHALLENGE, `${vocabId};${venueId}`);
};

export const logCompleteSentence = (sentence: string) => {
  const logger = getLogging();
  logger.recordEvent(LogAction.COMPLETE_SENTENCE, sentence);
};

export const logGainExp = (previousExp: number, expGained: number) => {
  const logger = getLogging();
  logger.recordEvent(LogAction.GAIN_EXP, String(expGained));
  /* TODO: log level up inside here */
};

export const logPosition = (lat: number, lng: number) => {
  const logger = getLogging();
  logger.recordEvent(LogAction.TRACK_POSITION, `${String(lat)};${String(lng)}`);
};

export const logReviewWrong = (vocabId: string) => {
  const logger = getLogging();
  logger.recordEvent(LogAction.REVIEW_WRONG, vocabId);
};

export const logAttachVocabToVenue = (vocabId: string, venueId: string) => {
  const logger = getLogging();
  logger.recordEvent(LogAction.ATTACH_VOCAB_TO_VENUE, `${vocabId};${venueId}`);
};

export const logSetVenueToChallenge = (
  testWordId: string,
  venueId: string,
  sentence: string
) => {
  const logger = getLogging();
  logger.recordEvent(
    LogAction.ATTACH_VOCAB_TO_VENUE,
    `${testWordId};${venueId};${sentence}`
  );
};

export const logJpDisplayStyle = (style: JpDisplayStyleType) => {
  const logger = getLogging();
  logger.recordEvent(LogAction.JP_DISPLAY_STYLE, style);
};
