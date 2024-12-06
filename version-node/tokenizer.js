const tf = require('@tensorflow/tfjs');

class Tokenizer {
  constructor() {
    this.wordIndex = {};
    this.indexWord = {};
  }

  fitOnTexts(texts) {
    let index = 1;
    texts.forEach(text => {
      const words = text.split(' ');
      words.forEach(word => {
        if (!(word in this.wordIndex)) {
          this.wordIndex[word] = index;
          this.indexWord[index] = word;
          index++;
        }
      });
    });
  }

  textsToSequences(texts) {
    return texts.map(text => text.split(' ').map(word => this.wordIndex[word] || 0));
  }

  padSequences(sequences, maxLength) {
    return sequences.map(seq => {
      while (seq.length < maxLength) {
        seq.push(0);
      }
      return seq.slice(0, maxLength);
    });
  }

  get vocabSize() {
    return Object.keys(this.wordIndex).length + 1;
  }
}

module.exports = Tokenizer;
