// colorpicker_new.js // replacement for colorpicker.js

// menu behaviors

// function applyMenuNavEvents(targetElements) {
//   targetElements = $(targetElements);
//   targetElements
//     .each(function(index) {
//       var thisTargetEl = $(this);
//       thisTargetEl.on('keyup', function(event) {

//       });
//     });
// }

// function applyMenuClickEvents(targetElements) {

// }

$(document).ready(function() {
  var testKey = $('#test-key');
  testKey
    .on('keyup', function(event) {
      if(validateKeyByName(event, 'enter'))     { console.log('enter'); }
      if(validateKeyByName(event, 'return'))    { console.log('return'); }
      if(validateKeyByName(event, 'left'))      { console.log('left'); }
      if(validateKeyByName(event, 'up'))        { console.log('up'); }
      if(validateKeyByName(event, 'right'))     { console.log('right'); }
      if(validateKeyByName(event, 'down'))      { console.log('down'); }
      if(validateKeyByName(event, 'pageup'))    { console.log('pageup'); }
      if(validateKeyByName(event, 'pagedown'))  { console.log('pagedown'); }
      if(validateKeyByName(event, 'home'))      { console.log('home'); }
      if(validateKeyByName(event, 'end'))       { console.log('end'); }
      if(validateKeyByName(event, 'alt-up'))    { console.log('alt-up'); }
      if(validateKeyByName(event, 'alt-left'))  { console.log('alt-left'); }
      if(validateKeyByName(event, 'alt-right')) { console.log('alt-right'); }
      if(validateKeyByName(event, 'alt-down'))  { console.log('alt-down'); }
    });

  function validateKeyByName(passedEvent, stringKeyName, osType) {
    // [ TASK : Add OS conditions for keyCodes ]
    var solution = { keyCode: [], shiftKey: false, altKey: '', ctrlKey: '', cmdKey: '', fnKey: '' };
    switch(stringKeyName) {
      case 'return'   :
      case 'enter'    : solution.keyCode  = 13;                             break;
      case 'left'     : solution.keyCode  = 37; solution.shiftKey = false;  break;
      case 'up'       : solution.keyCode  = 38; solution.shiftKey = false;  break;
      case 'right'    : solution.keyCode  = 39; solution.shiftKey = false;  break;
      case 'down'     : solution.keyCode  = 40; solution.shiftKey = false;  break;
      case 'altup'    :
      case 'alt-up'   : solution.keyCode  = 33; solution.shiftKey = true;   break;
      case 'altleft'  :
      case 'alt-left' : solution.keyCode  = 36; solution.shiftKey = true;   break;
      case 'altright' :
      case 'alt-right': solution.keyCode  = 35; solution.shiftKey = true;   break;
      case 'altdown'  :
      case 'alt-down' : solution.keyCode  = 34; solution.shiftKey = true;   break;
      case 'page-up'  :
      case 'pageup'   : solution.keyCode  = 33; solution.shiftKey = false;  break; // avoids alt-up
      case 'page-down':
      case 'pagedown' : solution.keyCode  = 34; solution.shiftKey = false;  break; // avoids alt-down
      case 'home'     : solution.keyCode  = 36; solution.shiftKey = false;  break; // avoids alt-left
      case 'end'      : solution.keyCode  = 35; solution.shiftKey = false;  break; // avoids alt-right
    }
    if((solution.shiftKey == passedEvent.shiftKey || solution.shiftKey.length == 0) && (solution.keyCode == passedEvent.keyCode)) 
    { return true; } else { return false; }
  }
});
