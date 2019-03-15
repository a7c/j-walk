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

        load: async () => {
          this._db = TAFFY();
          const sentences = sentencesJson.sentences;
          for (const [en, jp] of sentences) {
            this._db.insert({ english: en, japanese: jp });
          }
        },
      };
    }
    return this._instance;
  },
};

export default SentenceDatabase;
