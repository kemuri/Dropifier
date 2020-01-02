const { Menu, Tray, clipboard, dialog, Notification } = require('electron')
const path = require('path');

class DropTray{

   constructor(name){   }

   static init(icon_path,app_ref) {
      this._tray = new Tray(path.join(__dirname, icon_path));
      this._tray.setToolTip('Dropifier ' + app_ref.getVersion());
      this._app = app_ref;

      DropTray._defaultmenu = [
         {label: 'Settings', submenu: [
            {click : this.onFolderClick, label: 'Open folder only', type: 'checkbox', checked: dataStore.get('enclosing_only'), enabled: true},
            {click : this.onNotificationsClick, label: 'Show notifications', type: 'checkbox', checked: dataStore.get('show_notifciations'), enabled: true},
            {click : this.onStartupClick, label: 'Launch on startup', type: 'checkbox', checked: dataStore.get('startup'), enabled: true},
            {type: 'separator' },
            {click : this.onDropboxSetup, label: 'Change Dropbox folder', enabled: true}
         ]},
         {click: this.onQuitClick,  label: 'Quit' }
      ];

      //TODO: ADD Load history from file

      this._tray.setContextMenu(Menu.buildFromTemplate(DropTray._defaultmenu));
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
      global.sharedObj = {db_path: result};
      dataStore.set('dropbox_path', result[0]);
      return result;
   }

   static onFileDrop(event,files) {
      
      if (files[0].startsWith(dataStore.get('dropbox_path'))) {
         let file_path = files[0].substring(dataStore.get('dropbox_path').length, files[0].length)
         let url = PROTOCOL_PREFIX + ":/" + file_path;
         clipboard.writeText(encodeURI(url));

         //Add item to history
         DropTray._updateHistory(url,encodeURI(url))

         DropTray.playDropAnimation();
              
         if (dataStore.get('show_notifciations')) {
            new Notification({ title: 'Link copied to your clipboard', body: url, silent:true, icon: path.join(__dirname, 'notification-ok.png')}).show();
         }  
      } else {
         console.log('error') 
         new Notification({ title: 'Dropifier failed!', body: 'The dropped file is probably not in your Dropbox folder.', silent:false, icon: path.join(__dirname, 'notification-error.png')}).show();
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

   static _updateHistory(url,raw_url) {

      DropTray._history.unshift({url:url, raw_url:raw_url});
      if (DropTray._history.length > 5) {
         DropTray._history.length = 5;
      }

      var updatedmenu = [];

      DropTray._history.forEach(function(item){
         updatedmenu.push({
            label: 'Copy ' + item.url.slice(item.url.lastIndexOf("/")),
            click: function () {
               clipboard.writeText(item.raw_url);
               DropTray.playDropAnimation();
            }
          });
      });
      updatedmenu.push({type: 'separator' });
      dataStore.set('drop_history', updatedmenu)
      
      DropTray._defaultmenu.forEach(function(item){
         updatedmenu.push(item);
      });

      
   
      DropTray._tray.setContextMenu(Menu.buildFromTemplate(updatedmenu));
      // render 
   }

}

DropTray._tray = undefined;
DropTray._app = undefined;
DropTray._history = [];
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