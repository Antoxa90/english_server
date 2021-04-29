const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const wordsSchema = new Schema({
  word: String,
  examples: [String],
  definition: String,
  type: String,
});

const mapWordsModel = ({ id, word, examples, definition, type }) => ({
  id,
  word,
  definition,
  examples,
  type,
})

module.exports = {
  wordsSchema,
  mapWordsModel,
};