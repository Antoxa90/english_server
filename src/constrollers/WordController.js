const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');
const { wordsSchema, mapWordsModel } = require('../models/WordsSchema');
const { connection } = require('../dbConnection');
const errorHandler = require('../utils/errorHandler');
const { parseWord } = require('../..');

const WordsModel = connection.addScheme(wordsSchema, 'Words', { plugins: [mongoosePaginate] });

module.exports = (app) => {
  // Get and search words with pagination
  app.get('/api/words', (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    let filter = {};
    if (search) {
      filter = { word: new RegExp(`^${search}`, 'i') };
    }

    WordsModel.paginate({ ...filter }, { page, limit, sort: { word: 1 } }, (error, result) => {
      if (error) {
        return errorHandler(`Can\'t get words (page: ${page})`, 'Error - get /api/words');
      }

      const data = result.docs.map(mapWordsModel);

      return res.json({
        data,
        page,
        limit,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
        total: result.totalPages,
      });
    });
  });

  // Get word by id
  app.get('/api/words/:id', (req, res) => {
    const id = req.params.id;
    WordsModel.find({ _id: id }, (error, data) => {
      if (error) {
        return errorHandler(`Can\'t get word with id ${id})`, 'Error - get /api/words/:id');
      }
      const mappedData = data.map(mapWordsModel);

      return res.status(200).json(mappedData[0]);
    })
  });

  // Get words by array of ids
  app.post('/api/pack-words', async (req, res) => {
    const ids = req.body.ids;
    const dbIds = ids.map(mongoose.Types.ObjectId);
    WordsModel.find({ '_id': { $in: dbIds } }, (error, data) => {
      if (error) {
        return errorHandler(`Can\'t get words by array of ids`, 'Error - post /api/pack-words');
      }

      console.log(data);
      const mappedData = data.map(mapWordsModel);
      return res.status(200).json(mappedData);
    })
  });

  // Update word by id
  app.put('/api/words/:id', (req, res) => {
    const newModel = req.body;
    WordsModel.updateOne({ _id: req.params.id }, { ...newModel }, (error, data) => {
      if (error) {
        return errorHandler(`Can\'t update row with id ${req.params.id})`, 'Error - put /api/words/:id');
      }

      console.log('updated', data);
      return res.status(200).json({ status: 'updated' });
    });
  })

  // Delete word by id
  app.delete('/api/words/:id', (req, res) => {
    WordsModel.deleteOne({ _id: req.params.id }, (error, data) => {
      if (error) {
        return errorHandler(`Can\'t delete row with id ${req.params.id})`, 'Error - delete /api/words/:id');
      }

      console.log('deleted', data)
      return res.status(200).json({ status: 'deleted' });
    });
  });

  // Create a new word
  app.post('/api/word', async (req, res) => {
    const word = req.body.word;
    const newModel = { ...(await parseWord(word)) };
    if (!newModel.word) {
      return res.status(400).json({ message: `Can\'t parse word ${word}` });
    }

    WordsModel.create({ ...newModel }, (error, data) => {
      if (error) {
        return errorHandler(`Can\'t add word`, 'Error - get /api/word');
      }

      console.log('created', data);
      return res.status(200).json(mapWordsModel(data));
    });
  });
}