const electron = require('electron');
const mongoose = require('mongoose');
const Record = require('./database/models/record');
const {
  RECORD_SAVED_CONFIRMATION_MESSAGE,
  RECORD_DELETED_CONFIRMATION_MESSAGE,
  REQUEST_TO_SAVE_RECORD,
  REQUEST_TO_SAVE_ID_TEMP,
  REQUEST_TO_FETCH_A_RECORD,
  REQUEST_TO_EDIT_A_RECORD,
  REQUEST_TO_FETCH_ALL_RECORDS,
  REQUEST_TO_CHECK_FOR_EDIT_REQUEST,
  REQUEST_TO_UPDATE_RECORD,
  REQUEST_TO_DELETE_A_RECORD,
  REQUEST_TO_CHECK_FOR_SUCCESSFUL_DELETION,
  RECORD_SAVED_CONFIRMATION,
  RECORD_FETCH_CONFIRMATION,
  RECORDS_FETCH_CONFIRMATION,
  RECORD_EDIT_PENDING_REQUEST,
  RECORD_UPDATE_CONFIRMATION,
  RECORD_DELETE_CONFIRMATION,
  RECORD_EDITED_CONFIRMATION_MESSAGE } = require('./constants');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let currentOpenRecord;
let editRequest;
let deletedRecord;

mongoose.connect('mongodb://localhost/style_records');
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 });
  mainWindow.loadURL(`file://${__dirname}/templates/home.html`);
});

ipcMain.on(REQUEST_TO_SAVE_RECORD, (event, recordData) => {
  const newRecord = new Record({
    title: recordData.title,
    author: recordData.author,
    keywords: recordData.keywords,
    content: recordData.content,
    ogContent: recordData.ogContent,
    edited: recordData.edited,
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
          edited: fetchedRecords[i].edited,
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
          ogContent: fetchedRecord.ogContent,
          date: fetchedRecord.date,
          id: fetchedRecord._id.toString()
        };
        mainWindow.webContents.send(RECORD_EDIT_PENDING_REQUEST, record);
      });
  }
});

ipcMain.on(REQUEST_TO_UPDATE_RECORD, (event, recordData) => {
  const updatedRecord = {
    title: recordData.title,
    author: recordData.author,
    keywords: recordData.keywords,
    content: recordData.content,
    ogContent: recordData.ogContent,
    edited: recordData.edited,
    date: recordData.date
   };
  Record.findByIdAndUpdate(currentOpenRecord, updatedRecord)
    .then(() => {
      mainWindow.webContents.send(RECORD_UPDATE_CONFIRMATION, RECORD_EDITED_CONFIRMATION_MESSAGE);
    });
});

ipcMain.on(REQUEST_TO_DELETE_A_RECORD, () => {
  Record.findByIdAndRemove(currentOpenRecord)
    .then(() => {
      deletedRecord = true;
    });
});

ipcMain.on(REQUEST_TO_CHECK_FOR_SUCCESSFUL_DELETION, () => {
  if (deletedRecord) {
    deletedRecord = false;
    mainWindow.webContents.send(RECORD_DELETE_CONFIRMATION, RECORD_DELETED_CONFIRMATION_MESSAGE);
  }
});
