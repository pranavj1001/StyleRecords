const electron = require('electron');
const mongoose = require('mongoose');

const { app, BrowserWindow } = electron;

let mainWindow;

mongoose.connect('mongodb://localhost/style_records');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connection established');
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 });
  mainWindow.loadURL(`file://${__dirname}/templates/home.html`);
});
