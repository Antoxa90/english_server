const mongoosePaginate = require('mongoose-paginate-v2');
const { connection } = require('../dbConnection');
const { irregularVerbsSchema, mapIrregularVerbsModel } = require('../models/IrregularVerbsSchema');
const errorHandler = require('../utils/errorHandler');
const requireAuth = require('../utils/requireAuth');

const IrregularVerbsModel = connection.addScheme(irregularVerbsSchema, 'Verbs', { plugins: [mongoosePaginate] });

module.exports = (app) => {
  // Get all irregular verbs
  app.get('/api/irregular-verbs', requireAuth, async (req, res) => {
    const { page, limit = 10 } = req.query;
    let paginateOptions = {};
    if (typeof page === "undefined") {
      paginateOptions = {
        pagination: false,
      };
    } else {
      paginateOptions = { page, limit };
    }
    try {
      const result = await IrregularVerbsModel.paginate({}, paginateOptions);
      const data = result.docs.map(mapIrregularVerbsModel);

      return res.json({
        data,
        page,
        limit,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
        total: result.totalPages,
      });
    } catch (error) {
      errorHandler(`Can\'t get irregular verbs`, 'Error - get /api/irregular-verbs');
    }
  });
}