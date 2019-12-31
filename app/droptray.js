const { Menu, Tray, clipboard, dialog } = require('electron')
const path = require('path');

class DropTray{

   constructor(name){   }

   static init(icon_path,app_ref) {
      this._tray = new Tray(path.join(__dirname, icon_path));
      this._tray.setToolTip('Dropifier ')
      this._app = app_ref;

      this._menu = Menu.buildFromTemplate([
         {label: 'Settings', submenu: [
            {click : this.onFolderClick, label: 'Open folder only', type: 'checkbox', checked: dataStore.get('enclosing_only'), enabled: true},
            {click : this.onNotificationsClick, label: 'Show notifications', type: 'checkbox', checked: dataStore.get('show_notifciations'), enabled: true},
            {click : this.onStartupClick, label: 'Launch on startup', type: 'checkbox', checked: dataStore.get('startup'), enabled: true},
            {type: 'separator' },
            {click : this.onDropboxSetup, label: 'Set Dropbox folder', enabled: true}
         ]},
         {click: this.onQuitClick,  label: 'Quit' }
      ]);

      this._tray.setContextMenu(this._menu);
      this._tray.setPressedImage(path.join(__dirname, 'resources/icon-dropify-pressed-Template.png'));
      this._tray.on('drop-files', this.onFileDrop);

   }

   static onFolderClick(menuItem) {
      dataStore.set('enclosing_only', menuItem.checked);
   }

   static onNotificationsClick(menuItem) {
      dataStore.set('show_notifciations', menuItem.checked) 
   }

   static onStartupClick(menuItem) {
      dataStore.set('startup', menuItem.checked); 
      Dropifier.setLoginItemSettings({openAtLogin: menuItem.checked }); //start on login
   }

   static onQuitClick(menuItem) {
      Dropifier.quit();
   }

   static onDropboxSetup() {
      let result = dialog.showOpenDialogSync({ properties: ['openDirectory',] })
      dataStore.set('dropbox_path', result[0]);
   }

   static onFileDrop(event,files) {

      DropTray.playDropAnimation();
      
      if (files[0].startsWith(dataStore.get('dropbox_path'))) {
         let file_path = files[0].substring(dataStore.get('dropbox_path').length, files[0].length)
         let url = PROTOCOL_PREFIX + ":/" + file_path;
         clipboard.writeText(encodeURI(url));

         DropTray.playDropAnimation();
              
         if (dataStore.get('show_notifciations')) {
            new Notification({ title: 'Link copied to your clipboard', body: url, icon: path.join(__dirname, 'notification-ok.png')}).show();
         }  
      } else {
         console.log('error') 
         new Notification({ title: 'Dropify failed!', body: 'The selected file is probably not in your Dropbox folder.', icon: path.join(__dirname, 'notification-error.png')}).show();
      }
   }

   static playDropAnimation() {

      var count = 0;
      function animator() {
         if (count >= DropTray._animationFrames.length) { clearInterval(this); return true;}
         DropTray._tray.setImage(DropTray._animationFrames[count]);
         count++;
      }
      
      setInterval(animator, 60);
   }

}

DropTray._tray = undefined;
DropTray._app = undefined;
DropTray._animationFrames = [
   path.join(__dirname, 'resources/icon-dropify-anim00-Template.png'),
   path.join(__dirname, 'resources/icon-dropify-anim01-Template.png'),
   path.join(__dirname, 'resources/icon-dropify-anim02-Template.png'),
   path.join(__dirname, 'resources/icon-dropify-anim03-Template.png'),
   path.join(__dirname, 'resources/icon-dropify-anim04-Template.png'),
   path.join(__dirname, 'resources/icon-dropify-anim05-Template.png'),
   path.join(__dirname, 'resources/icon-dropify-anim06-Template.png'),
   path.join(__dirname, 'resources/icon-dropify-anim07-Template.png'),
   path.join(__dirname, 'resources/icon-dropify-anim08-Template.png'),
   path.join(__dirname, 'resources/icon-dropify-anim09-Template.png')
]

module.exports = DropTray;