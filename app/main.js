// Module to create native browser window.
require('dotenv').config();

const { app, Menu, Tray, dialog, shell, clipboard, protocol, Notification } = require('electron')
const path = require('path');
const Store = require('electron-store');
const PROTOCOL_PREFIX = 'Dropifier'

const store = new Store();

let tray = null;

app.on('ready', () => {
  app.dock.hide();
  //store.clear(); //imitate freesh install
  setup(); 
});

function setup() {

  // Setup dropbox on first run, show info message
  if (store.get('dropbox_path') == undefined) {
    dialog.showMessageBoxSync(null,{
      type: 'info',
      buttons: ['Select Dropbox folder'],
      defaultId: 1,
      title: 'Dropify setup',
      message: 'Take me to your Dropbox folder',
      detail: 'Please select your Dropbox folder location in the next step.'
    });

    setDropboxFolder();
  }

  //Register Dropify protocol
  protocol.registerHttpProtocol(PROTOCOL_PREFIX, (req, cb) => {});
  app.setAsDefaultProtocolClient(PROTOCOL_PREFIX)

  //Setup tray menu
  tray = new Tray(path.join(__dirname, 'resources/icon-dropify-Template.png'));

  const contextMenu = Menu.buildFromTemplate([
    { click: setDropboxFolder, label: 'Set Dropbox folder'},
    { type:'separator' },
    { click: (menuItem) => { 
        store.set('enclosing_only', menuItem.checked) 
      }, 
      label: 'Always open enclosing folder', type: 'checkbox', checked: store.get('enclosing_only'), enabled: true
    },
    { click: (menuItem) => { 
        store.set('show_notifciations', menuItem.checked) 
      }, 
      label: 'Show notifications', type: 'checkbox', checked: store.get('show_notifciations'), enabled: true
    }, 
    { click: (menuItem) => { 
        store.set('startup', menuItem.checked); 
        app.setLoginItemSettings({openAtLogin: menuItem.checked }); //start on login
      }, 
      label: 'Launch on startup', type: 'checkbox', checked: store.get('startup'),enabled: true
    }, 
    { type:'separator' },
    { click: () => { app.quit() },  label: 'Quit' }
  ])

  tray.setToolTip('Dropify')
  tray.setContextMenu(contextMenu)
  
  
  tray.on('drop-files', function(event, files) {
    if (files[0].startsWith(store.get('dropbox_path'))) {
      let file_path = files[0].substring(store.get('dropbox_path').length, files[0].length)
      let url = PROTOCOL_PREFIX + ":/" + file_path;
      clipboard.writeText(encodeURI(url));
      
      if (store.get('show_notifciations')) {
        new Notification({ title: 'Link copied to clipboard', body: url, icon: path.join(__dirname, 'notification-ok.png')}).show();
      } 
    } else {
      // if (store.get('show_notifciations')) {
        new Notification({ title: 'Dropify failed!', body: 'The selected file is not in your Dropbox folder.', icon: path.join(__dirname, 'notification-error.png')}).show();
      // }
    }
  });

}

//Save the dropbox path
function setDropboxFolder () {
  let result = dialog.showOpenDialogSync({ properties: ['openDirectory',] })
  if (result != undefined) { // we have a valid selection
    store.set('dropbox_path', result[0]);
  } else { //User pressed cancel, show error message
    showMissingDropboxError();
  }
}

function showMissingDropboxError() {
  let res = dialog.showMessageBoxSync(null,{
    type: 'warning',
    buttons: ['OK','Select Dropbox folder'],
    defaultId: 2,
    title: 'Dropify setup',
    message: "In order to Dropify to work, you'll need to select it's location.",
    detail: 'You can do it anytime from the menubar app.'
  });

  if (res == 1) { 
    setDropboxFolder();
  }
}

app.on('open-url', function (event, url) {
  event.preventDefault();
  let real_url = decodeURI(store.get('dropbox_path') + url.substring(PROTOCOL_PREFIX.length+2));
  
  if (store.get('enclosing_only')) {
    shell.showItemInFolder(real_url);
  } else {
    shell.openItem(real_url)  
  }
})


app.on('activate', function () {

})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
