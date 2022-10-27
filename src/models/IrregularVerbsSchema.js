const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const irregularVerbsSchema = new Schema({
  verb: String,
  secondForm: String,
  thirdForm: String,
});

const mapIrregularVerbsModel = ({ id, verb, secondForm, thirdForm }) => ({
  id,
  verb,
  secondForm,
  thirdForm,
});

module.exports = {
  irregularVerbsSchema,
  mapIrregularVerbsModel,
};