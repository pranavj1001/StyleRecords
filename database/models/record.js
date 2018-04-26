const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RecordSchema = new Schema({
  title: String,
  author: String,
  keywords: String,
  content: String,
  ogContent: String,
  date: Date
});

const Record = mongoose.model('record', RecordSchema);

module.exports = Record;
