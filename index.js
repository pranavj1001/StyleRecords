const electron = require('electron');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 });
  mainWindow.loadURL(`file://${__dirname}/templates/home.html`);
});

ipcMain.on('note: add', () => {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 });
  mainWindow.loadURL(`file://${__dirname}/templates/newNote.html`);
});
