const electron = require('electron');
const mongoose = require('mongoose');
const Record = require('./database/models/record');
const {
  RECORD_SAVED_CONFIRMATION_MESSAGE,
  REQUEST_TO_SAVE_RECORD,
  RECORD_SAVED_CONFIRMATION,
  RECORDS_FETCH_CONFIRMATION,
  REQUEST_TO_FETCH_ALL_RECORDS } = require('./constants');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

mongoose.connect('mongodb://localhost/style_records');
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

ipcMain.on(REQUEST_TO_SAVE_RECORD, (event, recordData) => {
  const newRecord = new Record({
    title: recordData.title,
    author: recordData.author,
    keywords: recordData.keywords,
    content: recordData.content,
    date: recordData.date
   });
  newRecord.save()
    .then(() => {
      mainWindow.webContents.send(RECORD_SAVED_CONFIRMATION, RECORD_SAVED_CONFIRMATION_MESSAGE);
    });
});

ipcMain.on(REQUEST_TO_FETCH_ALL_RECORDS, () => {
  Record.find({})
    .then((fetchedRecords) => {
      mainWindow.webContents.send(RECORDS_FETCH_CONFIRMATION, fetchedRecords);
    });
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 });
  mainWindow.loadURL(`file://${__dirname}/templates/home.html`);
});
