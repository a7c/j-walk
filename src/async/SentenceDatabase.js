/*
 * @flow
 */

import TAFFY from 'src/util/Taffy';

const sentencesJson = require('data/sentences');

const SentenceDatabase = {
  _instance: null,
  get db() {
    if (!this._instance) {
      this._instance = {
        _db: null,
        _hasLoaded: true,

        /** Asynchronously loads the sentence database. */
        load: async () => {
          this._db = TAFFY();
          const sentences = sentencesJson.sentences;
          for (const [en, jp] of sentences) {
            this._db.insert({ english: en, japanese: jp });
          }
          this._hasLoaded = true;
        },

        queryJapaneseKeywords: (...keywords: Array<string>) => {
          const query = keywords.map(keyword => {
            return {
              japanese: {
                likenocase: keyword,
              },
            };
          });
          if (this._hasLoaded) {
            return this._db(...query);
          } else {
            console.warn(
              'SentenceDatabase#queryKeywords: Sentence DB has not yet been loaded!'
            );
            return null;
          }
        },
      };
    }
    return this._instance;
  },
};

export default SentenceDatabase;
