const {remote, ipcRenderer} = require('electron');
const {BrowserWindow} = remote;
const win = BrowserWindow.getFocusedWindow();

// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('set_', function(event, message) {
  console.log(message);  // Prints "whoooooooh!"
});


window.onload = function() {
  var active_step = 0;
  var number_alpha = .4;
  var animspeed = 650;
  var interval;

  $(function() {
    var items = [
      {content: $('ul.steps li:nth(0)'), image: $('ul.stepper li:nth(0)')},
      {content: $('ul.steps li:nth(1)'), image: $('ul.stepper li:nth(1)')},
      {content: $('ul.steps li:nth(2)'), image: $('ul.stepper li:nth(2)')}
    ]

    items[1].content.hide();
    items[2].content.hide();

    items[1].image.fadeTo(0,number_alpha);
    items[2].image.fadeTo(0,number_alpha);

    $('a.dbpath').html(remote.getGlobal('sharedObj').db_path);

    function animateStep() {
      items[active_step].content.fadeTo(animspeed,0);
      items[active_step].image.fadeTo(animspeed,number_alpha);

      if (active_step+1 >= items.length) { 
        active_step = -1;
      }

      items[active_step+1].content.fadeTo(animspeed,1);
      items[active_step+1].image.fadeTo(animspeed,1);

      active_step++;
    }

    $('ul.steps').click(function(){
      clearInterval(interval);
      animateStep();
    });

    $('a.close, button.btn_ok').click(function(){
      ipcRenderer.sendSync('close_window')
    })

    $('a.dbpath').click(function() {
      // var new_path = 
      $('a.dbpath').html(ipcRenderer.sendSync('select_path'));
    });

    $

    interval = setInterval(animateStep, 3000);
  });
  

};


  