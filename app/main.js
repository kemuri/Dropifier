// Module to create native browser window.
require('dotenv').config();

const { app, Menu, Tray, dialog, shell, clipboard, protocol, Notification } = require('electron')
const path = require('path');
const dropTray = require('./droptray');
const Store = require('electron-store');
const fs = require('fs');



//Global variables
PROTOCOL_PREFIX = 'Dropifier'
dataStore = new Store();
Dropifier = app;

app.on('ready', () => {
  // app.dock.hide();
  dataStore.clear(); //imitate freesh install

  //Register Dropifier protocol
  protocol.registerHttpProtocol(PROTOCOL_PREFIX, (req, cb) => {});
  app.setAsDefaultProtocolClient(PROTOCOL_PREFIX)

  //Detect dropbox path if not yet set ->  ~/.dropbox/info.json
  if (dataStore.get('dropbox_path') == undefined) {
    try {
      let dropbox_info = JSON.parse(fs.readFileSync(process.env.HOME + '/.dropbox/info.json'));
      let path = dropbox_info.business ? dropbox_info.business.root_path : dropbox_info.personal.root_path; // user personal if available
      dataStore.set('dropbox_path', path );

    } catch (error) { //show error message if auto discovery failed
      console.log(error);
      dialog.showMessageBoxSync(null,{
        type: 'error',
        buttons: ['OK'],
        title: 'Dropifier',
        message: 'Error occured while trying to find your Dropbox folder.',
        detail: 'You can set it up later manuall by clicking the Dropifier icon in the menu bar.'
      });
    }
  }

  //Setup tray menu
  dropTray.init('resources/icon-dropify-Template.png',app);

});

//Save the dropbox path
// function setDropboxFolder () {
//   let result = dialog.showOpenDialogSync({ properties: ['openDirectory',] })
//   if (result != undefined) { // we have a valid selection
//     store.set('dropbox_path', result[0]);
//   } else { //User pressed cancel, show error message
//     showMissingDropboxError();
//   }
// }

// function showMissingDropboxError() {
//   let res = dialog.showMessageBoxSync(null,{
//     type: 'warning',
//     buttons: ['OK','Select Dropbox folder'],
//     defaultId: 2,
//     title: 'Dropify setup',
//     message: "In order to Dropify to work, you'll need to select it's location.",
//     detail: 'You can do it anytime from the menubar app.'
//   });

//   if (res == 1) { 
//     setDropboxFolder();
//   }
// }

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
