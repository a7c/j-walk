/**
 * @flow
 */

import type { VocabEntry } from 'src/entities/Types';

type JishoEntrySense = {
  english_definitions: Array<string>,
};
type JishoEntryJapanese = {
  reading: string,
  word: string,
};
type JishoEntry = {
  is_common: boolean,
  japanese: Array<JishoEntryJapanese>,
  senses: Array<JishoEntrySense>,
};
type JishoResponse = {
  data: Array<JishoEntry>,
};

export const fetchVocab = async (
  keyword: string
): Promise<Array<VocabEntry>> => {
  const _apiUrlHead = 'http://jisho.org/api/v1/search/words?keyword="';
  const _apiUrlTail = '"';

  try {
    const response = await fetch(_apiUrlHead + keyword + _apiUrlTail);
    const responseJson = await response.json();
    console.log(responseJson);
    // return [];
    const results: JishoResponse = JSON.parse(responseJson.body);
    console.log(results);

    const vocabEntries: Array<VocabEntry> = results.data.reduce(
      (acc, wordData) => {
        const vocabEntry = _processVocabWord(wordData);
        if (vocabEntry) {
          acc.push(vocabEntry);
        }
        return acc;
      },
      []
    );
    console.log(vocabEntries);
    return vocabEntries;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const _processVocabWord = (wordData: JishoEntry): ?VocabEntry => {
  if (!wordData.is_common) {
    return null;
  }
  const reading = wordData.japanese[0].reading;
  // if no kanji, then use reading as word
  const word = wordData.japanese[0].word || reading;
  const english = wordData.senses[0].english_definitions[0];

  const id = word + ':' + english;
  return {
    id,
    word,
    reading,
    english,
  };
};
