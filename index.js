const electron = require('electron');
const mongoose = require('mongoose');
const Record = require('./database/models/record');
const {
  RECORD_SAVED_CONFIRMATION_MESSAGE,
  REQUEST_TO_SAVE_RECORD,
  REQUEST_TO_SAVE_ID_TEMP,
  REQUEST_TO_FETCH_A_RECORD,
  REQUEST_TO_EDIT_A_RECORD,
  REQUEST_TO_FETCH_ALL_RECORDS,
  REQUEST_TO_CHECK_FOR_EDIT_REQUEST,
  RECORD_SAVED_CONFIRMATION,
  RECORD_FETCH_CONFIRMATION,
  RECORDS_FETCH_CONFIRMATION,
  RECORD_EDIT_PENDING_REQUEST } = require('./constants');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let currentOpenRecord;
let editRequest;

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
    ogContent: recordData.ogContent,
    date: recordData.date
   });
  newRecord.save()
    .then(() => {
      mainWindow.webContents.send(RECORD_SAVED_CONFIRMATION, RECORD_SAVED_CONFIRMATION_MESSAGE);
    });
});

ipcMain.on(REQUEST_TO_FETCH_ALL_RECORDS, () => {
  const records = [];
  Record.find({})
    .then((fetchedRecords) => {
      for (let i = 0; i < fetchedRecords.length; i++) {
        const record = {
          title: fetchedRecords[i].title,
          author: fetchedRecords[i].author,
          keywords: fetchedRecords[i].keywords,
          content: fetchedRecords[i].content,
          date: fetchedRecords[i].date,
          id: fetchedRecords[i]._id.toString()
        };
        records.push(record);
      }
      mainWindow.webContents.send(RECORDS_FETCH_CONFIRMATION, records);
    });
});

ipcMain.on(REQUEST_TO_SAVE_ID_TEMP, (event, id) => {
  currentOpenRecord = id;
});

ipcMain.on(REQUEST_TO_FETCH_A_RECORD, () => {
  Record.findById(currentOpenRecord)
    .then((record) => {
      mainWindow.webContents.send(RECORD_FETCH_CONFIRMATION, record);
    });
});

ipcMain.on(REQUEST_TO_EDIT_A_RECORD, () => {
  editRequest = true;
});

ipcMain.on(REQUEST_TO_CHECK_FOR_EDIT_REQUEST, () => {
  if (editRequest) {
    Record.findById(currentOpenRecord)
      .then((fetchedRecord) => {
        const record = {
          title: fetchedRecord.title,
          author: fetchedRecord.author,
          keywords: fetchedRecord.keywords,
          content: fetchedRecord.content,
          date: fetchedRecord.date,
          id: fetchedRecord._id.toString()
        };
        mainWindow.webContents.send(RECORD_EDIT_PENDING_REQUEST, record);
      });
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 });
  mainWindow.loadURL(`file://${__dirname}/templates/home.html`);
});
