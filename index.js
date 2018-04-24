const electron = require('electron');
const mongoose = require('mongoose');
const Record = require('./database/models/record');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

mongoose.connect('mongodb://localhost/style_records');
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

ipcMain.on('record: save', (event, recordData) => {
  const newRecord = new Record({
    title: recordData.title,
    author: recordData.author,
    keywords: recordData.keywords,
    content: recordData.content,
    date: recordData.date
   });
  newRecord.save()
    .then(() => {
      mainWindow.webContents.send('record: saved_confirmation', 'Your record has been saved!');
    });
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 });
  mainWindow.loadURL(`file://${__dirname}/templates/home.html`);
});
