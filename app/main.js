// Module to create native browser window.
require('dotenv').config();

const { app, Menu, Tray, dialog, shell, clipboard, protocol, Notification, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path');
const dropTray = require('./droptray');
const Store = require('electron-store');
const fs = require('fs');

//Global variables
PROTOCOL_PREFIX = 'Dropifier'
dataStore = new Store();
Dropifier = app;
introWindow = undefined;

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// })

app.on('ready', () => {
  app.dock.hide();
  // dataStore.clear(); //imitate fresh install

  if (dataStore.size == 0) { //this is the first start, show intro window
    introWindow = new BrowserWindow({width: 360, height: 600, frame: false, webPreferences: { nodeIntegration: true }});
    introWindow.loadURL('file://' + __dirname + '/resources/intro.html');

    // introWindow.webContents.on('did-finish-load', function() {
    //   introWindow.webContents.send('ping', 'whoooooooh!');
    // });

    // introWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    introWindow.on('closed', function() { introWindow = null; });
  }

  //Register Dropifier protocol
  protocol.registerHttpProtocol(PROTOCOL_PREFIX, (req, cb) => {});
  app.setAsDefaultProtocolClient(PROTOCOL_PREFIX)

  //Detect dropbox path if not yet set ->  ~/.dropbox/info.json
  if (dataStore.get('dropbox_path') == undefined) {
    try {
      let dropbox_info = JSON.parse(fs.readFileSync(process.env.HOME + '/.dropbox/info.json'));
      let path = dropbox_info.business ? dropbox_info.business.root_path : dropbox_info.personal.root_path; // user business dropbox account if available
      
      global.sharedObj = {db_path: path};
      dataStore.set('dropbox_path', path );

    } catch (error) { //show error message if auto discovery failed
      console.log(error);
      dialog.showMessageBoxSync(null,{
        type: 'error',
        buttons: ['OK'],
        title: 'Dropifier',
        message: 'Error occured while trying to find your Dropbox folder.',
        detail: 'You can set it up later manually by clicking the Dropifier icon in the menu bar.'
      });
    }
  }

  //Setup tray menu
  dropTray.init('resources/icon-dropify-Template.png',app);
  // autoUpdater.checkForUpdates(); //Dev testing
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on('close_window', (event, arg) => {
  introWindow.hide();
})

ipcMain.on('select_path', (event, arg) => {
  let dbpath = dropTray.onDropboxSetup();
  event.returnValue = dbpath;
})

// autoUpdater.on('update-available', () => {
//   // Notify user
//   new Notification({ title: 'New version available!', body: 'A new version of the app is downloading.', silent:true }).show();
// });

// autoUpdater.on('update-downloaded', () => {
//   let restartNotification  = new Notification({ title: 'New version is available', body: 'Click here to install and restart Dropifier.', silent:true })
//   restartNotification.show();
//   restartNotification.on('click', (event) => {
//     autoUpdater.quitAndInstall();
//   })
// });

app.on('open-url', function (event, url) {
  event.preventDefault();
  let real_url = decodeURI(dataStore.get('dropbox_path') + url.substring(PROTOCOL_PREFIX.length+2));
  if (dataStore.get('enclosing_only')) {
    shell.showItemInFolder(real_url);
  } else {
    shell.openItem(real_url)  
  }
})


app.on('activate', function () {

})