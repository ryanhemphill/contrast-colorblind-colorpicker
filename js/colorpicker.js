// contrast-colorblind-colorpicker.js
// Colorpicker.JS provides the following features for the CAS colorpicker, version 1
// 1. location-dependent modal window popup [ DONE ]
// 2. realtime build of background gradient for each slider's color values
// 3. realtime update of current value to the text field and vice versa when text field value is changed
// 4. validation of values for text fields AND retention of previous value for text field if input is in error
// 5. drag-drop functionality to "save a palette" (font/background color pairing)
// 6. all features can be activated and tasks performed via focus management (plans for blind accessibility as well.)



// [ TASKS COMPLETED ]
// 15 minutes...
// close function for modal window
// first TweenLite animation sequence

// 15 minutes...
// TweenLite animation of close
//

// START Utilities 

Object.byString = function(o, s) {
    s = String(s);
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

// END Utilities



// -- START modal window popup -- //
var colorDataObj = {};

$(document).ready(function() {
  
  colorDataObj.currentActiveTool = 'off';
  colorDataObj.targetContrast = 0;
  colorDataObj = initColorAnalysis( colorDataObj );
  // apply button functionality
  applyBasicMenuButtonBehaviors( $('a#cp_settings-button') );
  applyBasicMenuButtonBehaviors( $('a#cp_range-filter-button') );
  applyBasicMenuButtonBehaviors( $('a#cp_colorblindness-filter-button') );
  
  applyToolsDisplay();
  applyContrastFilterRadioButtons();
  $('#cp_tool-menu .dropdown-menu a.off').trigger('click');
  $('#cp_contrast-range-filter-button-group .dropdown-menu a.off').trigger('click');
  $('#cp_colorblindness-filter-button-group .dropdown-menu a.off').trigger('click');
  $('.cp_slider-textfield').trigger('change');
  
  setTimeout(function () { $('.cp_slider-textfield').first().trigger('change'); }, 500);
  
  colorDataObj = pullValuesFromRgbTexfields( colorDataObj );
 
  function pullValuesFromRgbTexfields() {
    
    var fontRed = Number($('#cp_font-color-settings .cp_slider-textfield').eq(0).val());
    var fontGreen = Number($('#cp_font-color-settings .cp_slider-textfield').eq(1).val());
    var fontBlue = Number($('#cp_font-color-settings .cp_slider-textfield').eq(2).val());
    var fontHEX = rgbToHex(fontRed, fontGreen, fontBlue);

    var bgRed = Number($('#cp_background-color-settings .cp_slider-textfield').eq(0).val());
    var bgGreen = Number($('#cp_background-color-settings .cp_slider-textfield').eq(1).val());
    var bgBlue = Number($('#cp_background-color-settings .cp_slider-textfield').eq(2).val());
    var bgHEX = rgbToHex(bgRed, bgGreen, bgBlue);

    colorDataObj.fontColors = {};
    colorDataObj.fontColors.r = fontRed;
    colorDataObj.fontColors.g = fontGreen;
    colorDataObj.fontColors.b = fontBlue;

    colorDataObj.fontColorsInHex = fontHEX;

    colorDataObj.bgColors = {};
    colorDataObj.bgColors.r = bgRed;
    colorDataObj.bgColors.g = bgGreen;
    colorDataObj.bgColors.b = bgBlue;

    colorDataObj.bgColorsInHex = bgHEX;

    return colorDataObj;
  }



// START DELETE
  var fontRed = Number($('#cp_font-color-settings .cp_slider-textfield').eq(0).val());
  var fontGreen = Number($('#cp_font-color-settings .cp_slider-textfield').eq(1).val());
  var fontBlue = Number($('#cp_font-color-settings .cp_slider-textfield').eq(2).val());
  var fontHEX = rgbToHex(fontRed, fontGreen, fontBlue);

  var bgRed = Number($('#cp_background-color-settings .cp_slider-textfield').eq(0).val());
  var bgGreen = Number($('#cp_background-color-settings .cp_slider-textfield').eq(1).val());
  var bgBlue = Number($('#cp_background-color-settings .cp_slider-textfield').eq(2).val());
  var bgHEX = rgbToHex(bgRed, bgGreen, bgBlue);
// END DELETE


  
  // setMarkerColor('font', fontHEX); // DELETE
  // setMarkerColor('background', bgHEX); // DELETE

  setMarkerColor('font', colorDataObj.fontColorInHex);
  setMarkerColor('background', colorDataObj.bgColorInHex);

  // setSampleArea( fontHEX, bgHEX ); // DELETE

  setSampleArea( colorDataObj.fontColorInHex, colorDataObj.bgColorInHex );



function updateSampleArea( fontColorValue, backgroundColorValue ) {
  $('#cp_sample-content')
    .css('color', '#' + fontColorValue)
    .css('background-color', '#' + backgroundColorValue);
  $('#cp_font-swatch').css('background-color', '#' + fontColorValue);
  $('#cp_background-swatch').css('background-color', '#' + backgroundColorValue);
}



setupCBtoggle();

function setMarkerColor( whichMarkers, hexColorValue ) {
  if(whichMarkers == 'font')       $('#cp_font-color-settings .cp_color-settings_marker-color').css('background-color', "#" + hexColorValue);
  if(whichMarkers == 'background') $('#cp_background-color-settings .cp_color-settings_marker-color').css('background-color', "#" + hexColorValue);
}

function setSampleArea( fontColorValue, backgroundColorValue ) {
  $('#cp_sample-content')
    .css('color', '#' + fontColorValue)
    .css('background-color', '#' + backgroundColorValue);
  $('#cp_font-swatch').css('background-color', '#' + fontColorValue);
  $('#cp_background-swatch').css('background-color', '#' + backgroundColorValue);
}



function updateSampleArea( fontColorValue, backgroundColorValue ) {
  $('#cp_sample-content')
    .css('color', '#' + fontColorValue)
    .css('background-color', '#' + backgroundColorValue);
  $('#cp_font-swatch').css('background-color', '#' + fontColorValue);
  $('#cp_background-swatch').css('background-color', '#' + backgroundColorValue);
}



// function setMarkerPlacement( colorDataObj ) {}
moveMarker( $('#cp_font-color-settings .cp_color-settings_slide-marker').eq(0), colorDataObj.fontColors.r );
moveMarker( $('#cp_font-color-settings .cp_color-settings_slide-marker').eq(1), colorDataObj.fontColors.g );
moveMarker( $('#cp_font-color-settings .cp_color-settings_slide-marker').eq(2), colorDataObj.fontColors.b );

moveMarker( $('#cp_background-color-settings .cp_color-settings_slide-marker').eq(0), colorDataObj.bgColors.r );
moveMarker( $('#cp_background-color-settings .cp_color-settings_slide-marker').eq(1), colorDataObj.bgColors.g );
moveMarker( $('#cp_background-color-settings .cp_color-settings_slide-marker').eq(2), colorDataObj.bgColors.b );
// }




var fontSliders = $('#cp_font-color-settings .cp_color-settings_slide');
buildCSSgradient(fontSliders.eq(0), 'red',   colorDataObj.fontColorInHex);
buildCSSgradient(fontSliders.eq(1), 'green', colorDataObj.fontColorInHex);
buildCSSgradient(fontSliders.eq(2), 'blue',  colorDataObj.fontColorInHex);

var backgroundSliders = $('#cp_background-color-settings .cp_color-settings_slide');
buildCSSgradient(backgroundSliders.eq(0), 'red',   colorDataObj.bgColorInHex);
buildCSSgradient(backgroundSliders.eq(1), 'green', colorDataObj.bgColorInHex);
buildCSSgradient(backgroundSliders.eq(2), 'blue',  colorDataObj.bgColorInHex); 
  
  
  
  
var textfieldElements = $('.cp_slider-textfield');
var slideMarkers = $('.cp_color-settings_slide-marker');
applyColorblindnessFilters(colorDataObj.colorblindActiveFilter);

enableClickDrag('.cp_color-settings_slider-container');

textfieldElements.focus(function() { var self = $(this); setTimeout(function () { self.select(); }, 50); });

textfieldElements.change(function() {

  colorDataObj = initColorAnalysis( colorDataObj ); 

  setMarkerColor('font', colorDataObj.fontColorInHex);
  setMarkerColor('background', colorDataObj.bgColorInHex);

  if($('#toggle-btn-colorblindness').hasClass('toggle-off')) { // non-colorblind
    
    setSampleArea( colorDataObj.fontColorInHex, colorDataObj.bgColorInHex );
  } else { // [ TASK - update with colorblindness toggle feature ]
    
    setSampleArea( colorDataObj.fontColorInHex, colorDataObj.bgColorInHex );
  }
  
  var contrastUpdateString = colorDataObj.currentContrast;  
  contrastUpdateString = contrastUpdateString.toFixed(1);

  if(colorDataObj.targetContrast != 0) {
    if(colorDataObj.targetContrast >= colorDataObj.currentContrast) contrastUpdateString = contrastUpdateString + ':1 Contrast, Fails Filter <span class="fa fa-exclamation-triangle" style="color:red;"></span>'
    if(colorDataObj.targetContrast <  colorDataObj.currentContrast) contrastUpdateString = contrastUpdateString + ':1 Contrast, Passes Filter <span class="fa fa-check" style="color:green;"></span>'
  }
  else if(colorDataObj.targetContrast == 0) {
    if(contrastUpdateString < 3) contrastUpdateString = contrastUpdateString + ', Fails all WCAG 2.0 Criteria <span class="fa fa-exclamation-triangle" style="color:red;"></span>';
    if(contrastUpdateString >= 3 && contrastUpdateString < 4.5) contrastUpdateString = contrastUpdateString + ', AA large text only <span class="fa fa-check" style="color:green;"></span>';
    if(contrastUpdateString >= 4.5 && contrastUpdateString < 7) contrastUpdateString = contrastUpdateString + ', AAA large text & AA small <span class="fa fa-check" style="color:green;"></span>';
    if(contrastUpdateString >= 7) contrastUpdateString = contrastUpdateString + ', Pass: AAA small text <span class="fa fa-check" style="color:green;"></span>';
  }

  $('#cp_a11y-status-update').html(contrastUpdateString);

  var fontSliders = $('#cp_font-color-settings .cp_color-settings_slide').not('.cp_colorblind-split');
  buildCSSgradient(fontSliders.eq(0), 'red', colorDataObj.fontColorInHex);
  buildCSSgradient(fontSliders.eq(1), 'green', colorDataObj.fontColorInHex);
  buildCSSgradient(fontSliders.eq(2), 'blue', colorDataObj.fontColorInHex);
  
  var backgroundSliders = $('#cp_background-color-settings .cp_color-settings_slide').not('.cp_colorblind-split');
  buildCSSgradient( backgroundSliders.eq(0), 'red',   colorDataObj.bgColorInHex);
  buildCSSgradient( backgroundSliders.eq(1), 'green', colorDataObj.bgColorInHex);
  buildCSSgradient( backgroundSliders.eq(2), 'blue',  colorDataObj.bgColorInHex); 

  
  $('#font-luminosity-result').text( colorDataObj.fontLuminance   );
  $('#bg-luminosity-result').text(   colorDataObj.bgLuminance     );
  $('#current-contrast').text(       colorDataObj.currentContrast );


  if(colorDataObj.currentContrast < colorDataObj.contrastTarget) $('.cp_color-settings_container').addClass('range-alert');
  if(colorDataObj.currentContrast > colorDataObj.contrastTarget) $('.cp_color-settings_container').removeClass('range-alert');


  if(colorDataObj.currentActiveTool == 'contrast') {
    setRangesForUI( colorDataObj );
  }

  if(colorDataObj.currentActiveTool == 'colorblindness') {
    colorDataObj.colorblindActiveFilter = $('#cp_colorblindness-filter-button').attr('data-filter-state');
    updateColorBlindnessGradient(colorDataObj.colorblindActiveFilter);
  }

  });

  $('.cp_color-settings_slide-marker, .cp_slider-textfield').keydown(function( event ) { event.stopImmediatePropagation(); stepNumber($(this),event);});
  $('.cp_color-settings_slide-marker').each(function() { 
    var self = $(this); 
    var textFieldTarget = self.parent().find('.cp_slider-textfield'); 
    enableMarkerDrag(self, textFieldTarget); 
  });
});  


function stepNumber( targetElement, passedEvent, newValue) {
  targetElement = $(targetElement);
  if(passedEvent) var thisKeyCode = passedEvent.keyCode;
  if(!passedEvent) {
    var textfieldElement = targetElement.parent().find('.cp_slider-textfield');
    textfieldElement
      .val(newValue)
      .attr('value', newValue)
      .trigger('change');
  }
  if(thisKeyCode >= 37 || thisKeyCode <= 40) {
    var targetElement, thisValue;
    if(targetElement.hasClass('cp_slider-textfield')) {
      thisValue = Number(targetElement.val());
      if(thisKeyCode == 38) {
        thisValue++;
        if(thisValue < 256) {
          targetElement
            .val(thisValue)
            .attr('value', thisValue)
            .trigger('change');
          setTimeout(function () { targetElement.select(); }, 50);
          var targetMarker = targetElement.parent().parent().find('.cp_color-settings_slide-marker');
          moveMarker( targetMarker, thisValue );  
        }
        
      } 
      if(thisKeyCode == 40) {
        thisValue--;
        if(thisValue > -1) {
          targetElement
            .val(thisValue)
            .attr('value', thisValue)
            .trigger('change');
          setTimeout(function () { targetElement.select(); }, 50);
          var targetMarker = targetElement.parent().parent().find('.cp_color-settings_slide-marker');
          moveMarker( targetMarker, thisValue );
        }
        
      }
      if(thisKeyCode >= 48 && thisKeyCode <= 57 || thisKeyCode == 8 || thisKeyCode == 46 || thisKeyCode == 13) {
        setTimeout(function () { 
          thisValue = Number(targetElement.val());
          var targetMarker = targetElement.parent().parent().find('.cp_color-settings_slide-marker');
          moveMarker( targetMarker, thisValue );
         }, 50);
      }
    }
    if(targetElement.hasClass('cp_color-settings_slide-marker')) {
      var textfieldElement = targetElement.parent().find('.cp_slider-textfield');
      if(thisKeyCode == 39) {
        thisValue = Number(textfieldElement.val());
        thisValue++;
        textfieldElement
          .val(thisValue)
          .attr('value', thisValue)
          .trigger('change');
        moveMarker( targetElement, thisValue );
      } 
      if(thisKeyCode == 37) {
        thisValue = Number(textfieldElement.val());
        thisValue--;
        textfieldElement
          .val(thisValue)
          .attr('value', thisValue)
          .trigger('change');
        moveMarker( targetElement, thisValue );
      }

    }
  }
} 

function moveMarker( targetMarker, newValue ) { // 
  // get width
  if(newValue > -1 && newValue < 256) {
    targetMarker.css('transform', 'translate3d(' + newValue + 'px, 0px, 0px)');
  }
}

function enableClickDrag( targetGroup ) {
  targetGroup = $(targetGroup);
  targetGroup.each(function() {
    var thisSlide = $(this).find('.cp_color-settings_slide');
    thisSlide.click(function(e){
      var slider = $(this);
      var container = slider.parent('.cp_color-settings_slider-container');
      var sliderOffset = slider.offset();
      var rel_X = Math.round(e.pageX - sliderOffset.left -15);
      if(rel_X > 255) { rel_X = 255; } else if(rel_X < 0) { rel_X = 0; }
      container.find('.cp_slider-textfield')
        .val(rel_X)
        .attr('value', rel_X)
        .trigger('change');
      moveMarker(container.find('.cp_color-settings_slide-marker'), rel_X);
    });
  });
  
}

// $("#test").click(function(e) {
//   var offset = $(this).offset();
//   var relativeX = (e.pageX - offset.left);
//   var relativeY = (e.pageY - offset.top);
//   alert(relativeX+':'+relativeY);
//   $(".position").val("afaf");
// });


function enableMarkerDrag( targetElement, targetTextField ) {
  var slideMarker = Draggable.create(targetElement, {
    type: 'x',
    throwProps: false,
    bounds: {minX:0, maxX:255},
    onDrag: update
  });

  function update() {
    var xValue = slideMarker[0].x;
    stepNumber( targetTextField, null, xValue );
  }
}



function addSliderMarkerMouseDrag( targetMarker, targetTextField, targetBoundary ) {
  var sliderValue = targetTextField.val();
  var markerDrag = Draggable.create(targetMarker, {type:"x", 
    onDrag: updateMarker

    });
  function updateMarker() {
    TweenLite.set(targetMarker, {x:sliderValue + 3.5}); //, onUpdate: )
  }
  updateMarker();
}
  




// -- START color gradient maker -- //



// function colorNumberConverter(conversionType, inputValue) {
  
  

  function buildCSSgradient( targetElement, gradientType, colorValues, colorDataObj ) { // initial 
    if(typeof colorValues === 'string' || colorValues instanceof String) var rgbValues_start = hexToRgb(colorValues), rgbValues_end = hexToRgb(colorValues);
    else { // assumes rgb as an object

    }

    if(gradientType == 'red') rgbValues_start.r = 0, rgbValues_end.r = 255;
    if(gradientType == 'green') rgbValues_start.g = 0, rgbValues_end.g = 255;
    if(gradientType == 'blue') rgbValues_start.b = 0, rgbValues_end.b = 255;
    if(gradientType == 'red' || gradientType == 'green' || gradientType == 'blue') {
      targetElement
        .css('background', '-moz-linear-gradient(left, rgb('                           + rgbValues_start.r + ',' + rgbValues_start.g + ',' + rgbValues_start.b + ') 0%, rgb('                 + rgbValues_end.r + ',' + rgbValues_end.g + ', ' + rgbValues_end.b + ') 100%)')
        .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + rgbValues_start.r + ',' + rgbValues_start.g + ',' + rgbValues_start.b + ')), color-stop(100%, rgb('  + rgbValues_end.r + ',' + rgbValues_end.g + ', ' + rgbValues_end.b + ')))')
        .css('background', '-webkit-linear-gradient(left, rgb('                        + rgbValues_start.r + ',' + rgbValues_start.g + ',' + rgbValues_start.b + ') 0%, rgb('                 + rgbValues_end.r + ',' + rgbValues_end.g + ', ' + rgbValues_end.b + ') 100%)')
        .css('background', '-o-linear-gradient(left, rgb('                             + rgbValues_start.r + ',' + rgbValues_start.g + ',' + rgbValues_start.b + ') 0%, rgb('                 + rgbValues_end.r + ',' + rgbValues_end.g + ', ' + rgbValues_end.b + ') 100%)')
        .css('background', '-ms-linear-gradient(left, rgb('                            + rgbValues_start.r + ',' + rgbValues_start.g + ',' + rgbValues_start.b + ') 0%, rgb('                 + rgbValues_end.r + ',' + rgbValues_end.g + ', ' + rgbValues_end.b + ') 100%)')
        .css('background', 'linear-gradient(to right, rgb('                            + rgbValues_start.r + ',' + rgbValues_start.g + ',' + rgbValues_start.b + ') 0%, rgb('                 + rgbValues_end.r + ',' + rgbValues_end.g + ', ' + rgbValues_end.b + ') 100%)');
    }


  }


  function rgbToHex(redValue, greenValue, blueValue) {
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    return "" + componentToHex(redValue) + componentToHex(greenValue) + componentToHex(blueValue);
  }


  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r:  parseInt(result[1], 16),  // red
        g: parseInt(result[2], 16),  // green 
        b:  parseInt(result[3], 16)   // blue
    } : null;
  }
  function hexToCMYK(hex) {
    var rgbValues = hexToRGB(hex);
    var result = {};
    result.firstValue  = 1 - rgbValues.firstValue;  // C
    result.secondValue = 1 - rgbValues.secondValue; // M
    result.thirdValue  = 1 - rgbValues.thirdValue;  // Y
    result.fourthValue = Math.min(result.firstValue,Math.min(result.secondValue,result.thirdValue)); // K
    return result;
  }

  function hexToHSV(hex) {
    var rgbValues = hexToRGB(hex);
    var result = {};
    var minRGB = Math.min(rgbValues.firstValue/255, Math.min(rgbValues.secondValue/255,rgbValues.thirdValue/255));
    var maxRGB = Math.max(rgbValues.firstValue/255, Math.max(rgbValues.secondValue/255,rgbValues.thirdValue/255));
    // Black-gray-white
    if(minRGB==maxRGB) {
      computedV = minRGB;
      return [0,0,computedV];
    }
  }


// -- END color gradient maker -- //








// START Menu Settings Behaviors 

  function applyBasicMenuButtonBehaviors( targetElement ) {
    targetElement = $(targetElement);
    var menuItemsOfTargetElement = targetElement.parent().parent().find('.dropdown-menu a');
    targetElement
      .on('keyup', function(e){
        if(e.keyCode == 27) toggleMenu( targetElement, false ); // esc = close menu
        // if(e.keyCode == 13) setTimeout(function () { targetElement.trigger('click');  }, 50);       // return = toggle menu open/close  
      })
      .on('click', function(){ toggleMenu( targetElement ); }); // open menu / close menu
    
    menuItemsOfTargetElement
      .on('keyup', function(e) {
        if(e.keyCode == 27) toggleMenu( targetElement, false );
        // if(e.keyCode == 13) toggleMenu( targetElement, true );
      })
      .on('click', function() {
        toggleMenu( targetElement, false );
      });
  }

  function toggleMenu( selfTargetElement, optionState ) {
    // if option is true/'true' or false/'false', the toggle only performs that action
    // otherwise, it flips state accordingly
    var allMenus = $('.btn-group button').not(selfTargetElement);
    selfTargetElement = $(selfTargetElement);
    var targetParent = selfTargetElement.parent().parent('.btn-group');
    if(!optionState) {
      targetParent.toggleClass('open');
    }
    if(optionState == true  || optionState == 'true')  targetParent.addClass('open');
    if(optionState == false || optionState == 'false') targetParent.removeClass('open');
  }
  
  function applyToolsDisplay() {
    var targetToolsMenuOptions = $('#cp_tool-menu .dropdown-menu a');
    targetToolsMenuOptions.on('click', function() {
      resetAllFilters();
      var selfTarget = $(this);
      if(selfTarget.hasClass('off')) {
        $('#cp_settings-active-tool').addClass('hide'); // also deactivate all filters
        $('.cp_colorblind-split').addClass('hide');
        $('.cp_color-settings_a11y-fail-range').addClass('hide');
      }            
      if(selfTarget.hasClass('contrast')) {
        colorDataObj.currentActiveTool = 'contrast';
        colorDataObj.colorblindActiveFilter = 'normal';
        
        $('#cp_settings-active-tool').removeClass('hide'); 
        $('.cp_colorblind-split').addClass('hide');
        var searchParam = $('#cp_settings-active-tool').find('.settings-group-container');
        searchParam.addClass('hide');
        searchParam.filter('#contrast-settings-container').removeClass('hide');
      
      }      
      if(selfTarget.hasClass('colorblindness')) {
        colorDataObj.currentActiveTool = 'colorblindness';
        $('#cp_settings-active-tool').removeClass('hide'); 
        
        $('.cp_color-settings_a11y-fail-range').addClass('hide');
        var searchParam = $('#cp_settings-active-tool').find('.settings-group-container');
        searchParam.addClass('hide');
        searchParam.filter('#colorblindness-settings-container').removeClass('hide');
      } 
    });
  }

  function applyColorblindnessFilters() {
    var targetFilterButtons = $('#cp_colorblindness-filter-button-group ul a');
    targetFilterButtons.each(function() {
      var selfTarget = $(this);
      
      selfTarget.on('click', function() {
        if(selfTarget.hasClass('off'))            {updateColorBlindnessGradient('normal');       $('#cp_colorblindness-filter-button').attr('data-filter-state', 'normal');}
        if(selfTarget.hasClass('protanopia'))     {updateColorBlindnessGradient('protanopia');   $('#cp_colorblindness-filter-button').attr('data-filter-state', 'protanopia');}
        if(selfTarget.hasClass('protanomaly'))    {updateColorBlindnessGradient('protanomaly');  $('#cp_colorblindness-filter-button').attr('data-filter-state', 'protanomaly');}
        if(selfTarget.hasClass('deuteranopia'))   {updateColorBlindnessGradient('deuteranopia'); $('#cp_colorblindness-filter-button').attr('data-filter-state', 'deuteranopia');}
        if(selfTarget.hasClass('deuteranomaly'))  {updateColorBlindnessGradient('deuteranomaly');$('#cp_colorblindness-filter-button').attr('data-filter-state', 'deuteranomaly');}
        if(selfTarget.hasClass('tritanopia'))     {updateColorBlindnessGradient('tritanopia');   $('#cp_colorblindness-filter-button').attr('data-filter-state', 'tritanopia');}
        if(selfTarget.hasClass('tritanomaly'))    {updateColorBlindnessGradient('tritanomaly');  $('#cp_colorblindness-filter-button').attr('data-filter-state', 'tritanomaly');}
        if(selfTarget.hasClass('achromatopsia'))  {updateColorBlindnessGradient('achromatopsia');$('#cp_colorblindness-filter-button').attr('data-filter-state', 'achromatopsia');}
        if(selfTarget.hasClass('achromatomaly'))  {updateColorBlindnessGradient('achromatomaly');$('#cp_colorblindness-filter-button').attr('data-filter-state', 'achromatomaly');}
        colorDataObj.currentActiveTool = 'colorblindness';
        colorDataObj.colorblindActiveFilter = $('#cp_colorblindness-filter-button').attr('data-filter-state');
        $('#cp_colorblindness-filter-button-group ul a.selected').removeClass('selected');
        selfTarget.addClass('selected');
      });
    })

  }

  function updateColorBlindnessGradient( targetState ) {
    if(!targetState) {
      if(colorDataObj.colorblindActiveFilter != 'normal') {
        targetState = colorDataObj.colorblindActiveFilter;
      } else {
        targetState = $('#cp_colorblindness-filter-button').attr('data-filter-state');
      }
    }
    if(targetState == 'normal') {
      colorDataObj.colorblindActiveFilter = 'normal';
      $('#cp_colorblindness-filter-button')
        .attr('data-filter-state', 'normal')
        .html('<span class="fa fa-adjust"></span> Colorblindness Filter <span class="caret"></span>');
      $('.cp_colorblind-split').addClass('hide');
    }
    else {
      colorDataObj.colorblindActiveFilter = targetState;
      $('#cp_colorblindness-filter-button')
        .attr('data-filter-state', targetState)
        .html('<span class="fa fa-low-vision"></span> Colorblindness Filter for <span class="cp_attention-text">' + targetState + '</span> <span class="caret"></span>');
      
      var desiredType = Object.byString( fBlind, targetState );

      // var fontObject
      var red_left_forFont    = desiredType([                         0, colorDataObj.fontColors.g, colorDataObj.fontColors.b]); 
      var red_right_forFont   = desiredType([                       255, colorDataObj.fontColors.g, colorDataObj.fontColors.b]); 
      var green_left_forFont  = desiredType([ colorDataObj.fontColors.r,                         0, colorDataObj.fontColors.b]); 
      var green_right_forFont = desiredType([ colorDataObj.fontColors.r,                       255, colorDataObj.fontColors.b]); 
      var blue_left_forFont   = desiredType([ colorDataObj.fontColors.r, colorDataObj.fontColors.g,                         0]); 
      var blue_right_forFont  = desiredType([ colorDataObj.fontColors.r, colorDataObj.fontColors.g,                       255]); 

      // var bgObject
      var red_left_forBg    = desiredType([                       0, colorDataObj.bgColors.g, colorDataObj.bgColors.b]); 
      var red_right_forBg   = desiredType([                     255, colorDataObj.bgColors.g, colorDataObj.bgColors.b]); 
      var green_left_forBg  = desiredType([ colorDataObj.bgColors.r,                       0, colorDataObj.bgColors.b]); 
      var green_right_forBg = desiredType([ colorDataObj.bgColors.r,                     255, colorDataObj.bgColors.b]); 
      var blue_left_forBg   = desiredType([ colorDataObj.bgColors.r, colorDataObj.bgColors.g,                       0]); 
      var blue_right_forBg  = desiredType([ colorDataObj.bgColors.r, colorDataObj.bgColors.g,                     255]); 

      var fontColorblindnessFilterTargets = $('#cp_font-color-settings .cp_colorblind-split');
      var bgColorblindnessFilterTargets   = $('#cp_background-color-settings .cp_colorblind-split');

      fontColorblindnessFilterTargets.eq(0) // red
          .css('background', '-moz-linear-gradient(left, rgb('                           + red_left_forFont[0] + ',' + red_left_forFont[1] + ',' + red_left_forFont[2] + ') 0%, rgb('                 + red_right_forFont[0]+ ','  + red_right_forFont[1] + ', ' + red_right_forFont[2] + ') 100%)')
          .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + red_left_forFont[0] + ',' + red_left_forFont[1] + ',' + red_left_forFont[2] + ')), color-stop(100%, rgb('  + red_right_forFont[0] + ',' + red_right_forFont[1] + ', ' + red_right_forFont[2] + ')))')
          .css('background', '-webkit-linear-gradient(left, rgb('                        + red_left_forFont[0] + ',' + red_left_forFont[1] + ',' + red_left_forFont[2] + ') 0%, rgb('                 + red_right_forFont[0] + ',' + red_right_forFont[1] + ', ' + red_right_forFont[2] + ') 100%)')
          .css('background', '-o-linear-gradient(left, rgb('                             + red_left_forFont[0] + ',' + red_left_forFont[1] + ',' + red_left_forFont[2] + ') 0%, rgb('                 + red_right_forFont[0] + ',' + red_right_forFont[1] + ', ' + red_right_forFont[2] + ') 100%)')
          .css('background', '-ms-linear-gradient(left, rgb('                            + red_left_forFont[0] + ',' + red_left_forFont[1] + ',' + red_left_forFont[2] + ') 0%, rgb('                 + red_right_forFont[0] + ',' + red_right_forFont[1] + ', ' + red_right_forFont[2] + ') 100%)')
          .css('background', 'linear-gradient(to right, rgb('                            + red_left_forFont[0] + ',' + red_left_forFont[1] + ',' + red_left_forFont[2] + ') 0%, rgb('                 + red_right_forFont[0] + ',' + red_right_forFont[1] + ', ' + red_right_forFont[2] + ') 100%)');
      
      fontColorblindnessFilterTargets.eq(1) // green
          .css('background', '-moz-linear-gradient(left, rgb('                           + green_left_forFont[0] + ',' + green_left_forFont[1] + ',' + green_left_forFont[2] + ') 0%, rgb('                 + green_right_forFont[0]+ ','  + green_right_forFont[1] + ', ' + green_right_forFont[2] + ') 100%)')
          .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + green_left_forFont[0] + ',' + green_left_forFont[1] + ',' + green_left_forFont[2] + ')), color-stop(100%, rgb('  + green_right_forFont[0] + ',' + green_right_forFont[1] + ', ' + green_right_forFont[2] + ')))')
          .css('background', '-webkit-linear-gradient(left, rgb('                        + green_left_forFont[0] + ',' + green_left_forFont[1] + ',' + green_left_forFont[2] + ') 0%, rgb('                 + green_right_forFont[0] + ',' + green_right_forFont[1] + ', ' + green_right_forFont[2] + ') 100%)')
          .css('background', '-o-linear-gradient(left, rgb('                             + green_left_forFont[0] + ',' + green_left_forFont[1] + ',' + green_left_forFont[2] + ') 0%, rgb('                 + green_right_forFont[0] + ',' + green_right_forFont[1] + ', ' + green_right_forFont[2] + ') 100%)')
          .css('background', '-ms-linear-gradient(left, rgb('                            + green_left_forFont[0] + ',' + green_left_forFont[1] + ',' + green_left_forFont[2] + ') 0%, rgb('                 + green_right_forFont[0] + ',' + green_right_forFont[1] + ', ' + green_right_forFont[2] + ') 100%)')
          .css('background', 'linear-gradient(to right, rgb('                            + green_left_forFont[0] + ',' + green_left_forFont[1] + ',' + green_left_forFont[2] + ') 0%, rgb('                 + green_right_forFont[0] + ',' + green_right_forFont[1] + ', ' + green_right_forFont[2] + ') 100%)');
      
      fontColorblindnessFilterTargets.eq(2) // blue
          .css('background', '-moz-linear-gradient(left, rgb('                           + blue_left_forFont[0] + ',' + blue_left_forFont[1] + ',' + blue_left_forFont[2] + ') 0%, rgb('                 + blue_right_forFont[0]+ ','  + blue_right_forFont[1] + ', ' + blue_right_forFont[2] + ') 100%)')
          .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + blue_left_forFont[0] + ',' + blue_left_forFont[1] + ',' + blue_left_forFont[2] + ')), color-stop(100%, rgb('  + blue_right_forFont[0] + ',' + blue_right_forFont[1] + ', ' + blue_right_forFont[2] + ')))')
          .css('background', '-webkit-linear-gradient(left, rgb('                        + blue_left_forFont[0] + ',' + blue_left_forFont[1] + ',' + blue_left_forFont[2] + ') 0%, rgb('                 + blue_right_forFont[0] + ',' + blue_right_forFont[1] + ', ' + blue_right_forFont[2] + ') 100%)')
          .css('background', '-o-linear-gradient(left, rgb('                             + blue_left_forFont[0] + ',' + blue_left_forFont[1] + ',' + blue_left_forFont[2] + ') 0%, rgb('                 + blue_right_forFont[0] + ',' + blue_right_forFont[1] + ', ' + blue_right_forFont[2] + ') 100%)')
          .css('background', '-ms-linear-gradient(left, rgb('                            + blue_left_forFont[0] + ',' + blue_left_forFont[1] + ',' + blue_left_forFont[2] + ') 0%, rgb('                 + blue_right_forFont[0] + ',' + blue_right_forFont[1] + ', ' + blue_right_forFont[2] + ') 100%)')
          .css('background', 'linear-gradient(to right, rgb('                            + blue_left_forFont[0] + ',' + blue_left_forFont[1] + ',' + blue_left_forFont[2] + ') 0%, rgb('                 + blue_right_forFont[0] + ',' + blue_right_forFont[1] + ', ' + blue_right_forFont[2] + ') 100%)');
     
      bgColorblindnessFilterTargets.eq(0) // red
          .css('background', '-moz-linear-gradient(left, rgb('                           + red_left_forBg[0] + ',' + red_left_forBg[1] + ',' + red_left_forBg[2] + ') 0%, rgb('                 + red_right_forBg[0]+ ','  + red_right_forBg[1] + ', ' + red_right_forBg[2] + ') 100%)')
          .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + red_left_forBg[0] + ',' + red_left_forBg[1] + ',' + red_left_forBg[2] + ')), color-stop(100%, rgb('  + red_right_forBg[0] + ',' + red_right_forBg[1] + ', ' + red_right_forBg[2] + ')))')
          .css('background', '-webkit-linear-gradient(left, rgb('                        + red_left_forBg[0] + ',' + red_left_forBg[1] + ',' + red_left_forBg[2] + ') 0%, rgb('                 + red_right_forBg[0] + ',' + red_right_forBg[1] + ', ' + red_right_forBg[2] + ') 100%)')
          .css('background', '-o-linear-gradient(left, rgb('                             + red_left_forBg[0] + ',' + red_left_forBg[1] + ',' + red_left_forBg[2] + ') 0%, rgb('                 + red_right_forBg[0] + ',' + red_right_forBg[1] + ', ' + red_right_forBg[2] + ') 100%)')
          .css('background', '-ms-linear-gradient(left, rgb('                            + red_left_forBg[0] + ',' + red_left_forBg[1] + ',' + red_left_forBg[2] + ') 0%, rgb('                 + red_right_forBg[0] + ',' + red_right_forBg[1] + ', ' + red_right_forBg[2] + ') 100%)')
          .css('background', 'linear-gradient(to right, rgb('                            + red_left_forBg[0] + ',' + red_left_forBg[1] + ',' + red_left_forBg[2] + ') 0%, rgb('                 + red_right_forBg[0] + ',' + red_right_forBg[1] + ', ' + red_right_forBg[2] + ') 100%)');
      
      bgColorblindnessFilterTargets.eq(1) // green
          .css('background', '-moz-linear-gradient(left, rgb('                           + green_left_forBg[0] + ',' + green_left_forBg[1] + ',' + green_left_forBg[2] + ') 0%, rgb('                 + green_right_forBg[0]+ ','  + green_right_forBg[1] + ', ' + green_right_forBg[2] + ') 100%)')
          .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + green_left_forBg[0] + ',' + green_left_forBg[1] + ',' + green_left_forBg[2] + ')), color-stop(100%, rgb('  + green_right_forBg[0] + ',' + green_right_forBg[1] + ', ' + green_right_forBg[2] + ')))')
          .css('background', '-webkit-linear-gradient(left, rgb('                        + green_left_forBg[0] + ',' + green_left_forBg[1] + ',' + green_left_forBg[2] + ') 0%, rgb('                 + green_right_forBg[0] + ',' + green_right_forBg[1] + ', ' + green_right_forBg[2] + ') 100%)')
          .css('background', '-o-linear-gradient(left, rgb('                             + green_left_forBg[0] + ',' + green_left_forBg[1] + ',' + green_left_forBg[2] + ') 0%, rgb('                 + green_right_forBg[0] + ',' + green_right_forBg[1] + ', ' + green_right_forBg[2] + ') 100%)')
          .css('background', '-ms-linear-gradient(left, rgb('                            + green_left_forBg[0] + ',' + green_left_forBg[1] + ',' + green_left_forBg[2] + ') 0%, rgb('                 + green_right_forBg[0] + ',' + green_right_forBg[1] + ', ' + green_right_forBg[2] + ') 100%)')
          .css('background', 'linear-gradient(to right, rgb('                            + green_left_forBg[0] + ',' + green_left_forBg[1] + ',' + green_left_forBg[2] + ') 0%, rgb('                 + green_right_forBg[0] + ',' + green_right_forBg[1] + ', ' + green_right_forBg[2] + ') 100%)');
      
      bgColorblindnessFilterTargets.eq(2) // blue
          .css('background', '-moz-linear-gradient(left, rgb('                           + blue_left_forBg[0] + ',' + blue_left_forBg[1] + ',' + blue_left_forBg[2] + ') 0%, rgb('                 + blue_right_forBg[0]+ ','  + blue_right_forBg[1] + ', ' + blue_right_forBg[2] + ') 100%)')
          .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + blue_left_forBg[0] + ',' + blue_left_forBg[1] + ',' + blue_left_forBg[2] + ')), color-stop(100%, rgb('  + blue_right_forBg[0] + ',' + blue_right_forBg[1] + ', ' + blue_right_forBg[2] + ')))')
          .css('background', '-webkit-linear-gradient(left, rgb('                        + blue_left_forBg[0] + ',' + blue_left_forBg[1] + ',' + blue_left_forBg[2] + ') 0%, rgb('                 + blue_right_forBg[0] + ',' + blue_right_forBg[1] + ', ' + blue_right_forBg[2] + ') 100%)')
          .css('background', '-o-linear-gradient(left, rgb('                             + blue_left_forBg[0] + ',' + blue_left_forBg[1] + ',' + blue_left_forBg[2] + ') 0%, rgb('                 + blue_right_forBg[0] + ',' + blue_right_forBg[1] + ', ' + blue_right_forBg[2] + ') 100%)')
          .css('background', '-ms-linear-gradient(left, rgb('                            + blue_left_forBg[0] + ',' + blue_left_forBg[1] + ',' + blue_left_forBg[2] + ') 0%, rgb('                 + blue_right_forBg[0] + ',' + blue_right_forBg[1] + ', ' + blue_right_forBg[2] + ') 100%)')
          .css('background', 'linear-gradient(to right, rgb('                            + blue_left_forBg[0] + ',' + blue_left_forBg[1] + ',' + blue_left_forBg[2] + ') 0%, rgb('                 + blue_right_forBg[0] + ',' + blue_right_forBg[1] + ', ' + blue_right_forBg[2] + ') 100%)');
      
      fontColorblindnessFilterTargets.removeClass('hide');
      bgColorblindnessFilterTargets.removeClass('hide');
    }

  }

  function applyContrastFilterRadioButtons() {
    // 2 functions performed: (1) change text to match selected filter (2) activate/deactivate ranges accordingly
    targetElements = $('#cp_contrast-range-filter-button-group .dropdown-menu a');
    targetElements_parentButton = $('#cp_range-filter-button');
    targetElements.each(function() {

      var selfTargetElement = $(this);
      
      selfTargetElement
        .on('click', function() {
          colorDataObj.currentActiveTool = 'contrast';
          colorDataObj.colorblindActiveFilter = 'normal';
          $('#cp_contrast-range-filter-button-group .dropdown-menu .selected').removeClass('selected');
          selfTargetElement.addClass('selected');
          if(selfTargetElement.hasClass('off')) {
            targetElements_parentButton.html('<span class="fa fa-adjust"></span> Contrast Range Filter <span class="caret"></span>');
            targetElements_parentButton.attr('data-filter-state', 'off');
            colorDataObj.targetContrast = 0;
            $('#target-contrast').text('OFF');
          }
          if(selfTargetElement.hasClass('aa_large')) {
            targetElements_parentButton.html('<span class="fa fa-adjust"></span> Contrast Filter: AA/Large <span class="caret"></span> ');
            targetElements_parentButton.attr('data-filter-state', 'aa-large' );
            colorDataObj.targetContrast = 3;
            $('#target-contrast').text('3');
          }
          if(selfTargetElement.hasClass('aa_small')) {
            targetElements_parentButton.html('<span class="fa fa-adjust"></span> Contrast Filter: AA/Small <span class="caret"></span> ');
            targetElements_parentButton.attr('data-filter-state', 'aa-small' );
            colorDataObj.targetContrast = 4.5;
            $('#target-contrast').text('4.5');
          }
          if(selfTargetElement.hasClass('aaa_large')) {
            targetElements_parentButton.html('<span class="fa fa-adjust"></span> Contrast Filter: AAA/Large <span class="caret"></span> ');
            targetElements_parentButton.attr('data-filter-state', 'aaa-large' );
            colorDataObj.targetContrast = 4.5;
            $('#target-contrast').text('4.5');
          }
          if(selfTargetElement.hasClass('aaa_small')) { 
            targetElements_parentButton.html('<span class="fa fa-adjust"></span> Contrast Filter: AAA/Small <span class="caret"></span> ');
            targetElements_parentButton.attr('data-filter-state', 'aaa-small' );
            colorDataObj.targetContrast = 7;
            $('#target-contrast').text('7');
          }
          $('#cp_slider_font_first-value').trigger('change');
      });
    });
  }


  function applyCustomContrastTextfieldBehaviors( targetTextfield ) {
    targetTextfield = $(targetTextfield);
    // autoselects all content when focused
    targetTextfield
      .focus(function() { var self = $(this); setTimeout(function () { self.select(); }, 50); })
      .keydown(function(e) {
        var self = $(this);
        var thisValue;
        var thisKeyCode = e.keyCode;

        if(thisKeyCode == 39) {
          thisValue = Number(textfieldElement.val());
          thisValue = thisValue + 0.1;
          textfieldElement
            .val(thisValue)
            .attr('value', thisValue)
            .trigger('change'); // a global update behavior needs to be created for this
        } 
        if(thisKeyCode == 37) {
          thisValue = Number(textfieldElement.val());
          thisValue = thisValue - 0.1;
          textfieldElement
            .val(thisValue)
            .attr('value', thisValue)
            .trigger('change'); // a global update behavior needs to be created for this
        }
      });
  } 

// END Menu Settings Behaviors



function defineGreaterLuminance( fontColorSample, bgColorSample ) {
  var fontColorObj  = hexToRgb( fontColorSample );
  var bgColorObj    = hexToRgb( bgColorSample );
  var fontColorLuminance = calcLuminance( fontColorObj.r, fontColorObj.g, fontColorObj.b );
  var bgColorLuminance = calcLuminance( bgColorObj.r, bgColorObj.g, bgColorObj.b );
  var greaterLuminanceValue = function() {
    if(fontColorLuminance > bgColorLuminance) return 'font';
    if(fontColorLuminance < bgColorLuminance) return 'bg';
    else return 'equal';
  }
  var returnObject = {};
  returnObject.fontColorObj = fontColorObj;
  returnObject.bgColorObj = bgColorObj;
  returnObject.fontLum = fontColorLuminance;
  returnObject.bgLum = bgColorLuminance;
  returnObject.greaterLum = greaterLuminanceValue;
  return returnObject;
}


function initColorAnalysis( colorDataObj ) {
  // get colors in hex - this is because hex is the simplest means to translate to different color formats
  

  if(!colorDataObj.targetContrast) colorDataObj.targetContrast = 0;
  // colorDataObj.targetContrast = targetContrast;
  
  var fontRed   = Number($('#cp_slider_font_first-value').val()); 
  var fontGreen = Number($('#cp_slider_font_second-value').val()); 
  var fontBlue  = Number($('#cp_slider_font_third-value').val()); 
  var fontColorInHex = rgbToHex( fontRed, fontGreen, fontBlue );
  var bgRed     = Number($('#cp_slider_bg_first-value').val()); 
  var bgGreen   = Number($('#cp_slider_bg_second-value').val()); 
  var bgBlue    = Number($('#cp_slider_bg_third-value').val()); 
  var bgColorInHex = rgbToHex( bgRed, bgGreen, bgBlue );
  
  colorDataObj = buildColorDataObject( fontColorInHex, bgColorInHex, colorDataObj );
  

  colorDataObj.currentContrast = calcContrast( colorDataObj );
  
  if(colorDataObj.targetContrast != 0) {

    $('#target-contrast').text(colorDataObj.targetContrast);

    if(colorDataObj.brighterColorIs == 'font') colorDataObj = calcRequiredLuminance( colorDataObj.fontLuminance, colorDataObj.bgLuminance, colorDataObj.targetContrast, colorDataObj );
    if(colorDataObj.brighterColorIs == 'bg')   colorDataObj = calcRequiredLuminance( colorDataObj.bgLuminance, colorDataObj.fontLuminance, colorDataObj.targetContrast, colorDataObj );

    
    if(colorDataObj.currentActiveTool == 'contrast') {
      colorDataObj = getContrastRangeValues_NEW( colorDataObj );
      setRangesForUI( colorDataObj );
    }
  }

  return colorDataObj;
  
}



function buildColorDataObject( fontColorInHex, bgColorInHex, colorDataObj ) {
  
  var returnDataObject = colorDataObj;

  returnDataObject.fontColorInHex = fontColorInHex;
  returnDataObject.bgColorInHex = bgColorInHex;
  
  var fontColors = hexToRgb( fontColorInHex );
  returnDataObject.fontColors = fontColors;
  var bgColors = hexToRgb( bgColorInHex );
  returnDataObject.bgColors = bgColors;
  
  var fontLuminance = calcLuminance( fontColors.r, fontColors.g, fontColors.b );
  returnDataObject.fontLuminance = fontLuminance;
  
  var bgLuminance = calcLuminance( bgColors.r, bgColors.g, bgColors.b );
  returnDataObject.bgLuminance = bgLuminance;
  
  if( fontLuminance > bgLuminance ) returnDataObject.brighterColorIs = 'font';
  if( fontLuminance < bgLuminance ) returnDataObject.brighterColorIs = 'bg';
  if( fontLuminance == bgLuminance ) returnDataObject.brighterColorIs = 'equal';

  return returnDataObject;

}


function calcLuminance( redValue, greenValue, blueValue ) {
  return 0.2126*useLuminanceMultiplier(redValue) + 0.7152*useLuminanceMultiplier(greenValue) + 0.0722*useLuminanceMultiplier(blueValue);
}

function calcContrast( colorDataObj ) {
  if(colorDataObj.brighterColorIs == 'font') return ( (colorDataObj.fontLuminance + 0.05) / (colorDataObj.bgLuminance + 0.05) ); 
  else if(colorDataObj.brighterColorIs == 'bg') return ( (colorDataObj.bgLuminance + 0.05) / (colorDataObj.fontLuminance + 0.05) ); 
  else if(colorDataObj.brighterColorIs == 'equal') return 1;
}

function useLuminanceMultiplier( sourceValue ) {
  if(sourceValue / 255 <= 0.03928) return sourceValue / 255 / 12.92;
  else return Math.pow((sourceValue/255 + 0.055)/1.055, 2.4);
}

function removeLuminanceMultiplier( targetAdjustedValue ) { // same as getOriginalValue()
  var resultValue;
  if( targetAdjustedValue <= 0.0031 ) resultValue = targetAdjustedValue * 255 * 12.92;
  else resultValue = 255 * ( 1.055 * ( Math.pow(targetAdjustedValue, 1/2.4)  ) - 0.055);
  resultValue = Math.round(resultValue);
  return resultValue;
}


function calcRequiredLuminance( greaterLuminance, lesserLuminance, targetContrast, colorDataObj ) {
  var greaterLuminanceTarget = colorDataObj.targetContrast * ( lesserLuminance + 0.05 ) - 0.05;
  var lesserLuminanceTarget =  ((greaterLuminance + 0.05) / colorDataObj.targetContrast ) - 0.05;
  var returnObject = colorDataObj;
  returnObject.greaterLumTarget = greaterLuminanceTarget;
  returnObject.lesserLumTarget  = lesserLuminanceTarget;
  return returnObject;
}



function getContrastRangeValues_NEW( colorDataObj ) {

  if( colorDataObj.brighterColorIs == 'font' && colorDataObj.targetContrast != 0 ) {
    // get font range values first
    var adjRed_font    = useLuminanceMultiplier(colorDataObj.fontColors.r);
    var adjGreen_font  = useLuminanceMultiplier(colorDataObj.fontColors.g);
    var adjBlue_font   = useLuminanceMultiplier(colorDataObj.fontColors.b);
    var fontRangeRed    = ( colorDataObj.greaterLumTarget - ( 0.7152 * adjGreen_font )  - ( 0.0722 * adjBlue_font ) )  / 0.2126;
    var fontRangeGreen  = ( colorDataObj.greaterLumTarget - ( 0.2126 * adjRed_font   )  - ( 0.0722 * adjBlue_font ) )  / 0.7152;
    var fontRangeBlue   = ( colorDataObj.greaterLumTarget - ( 0.7152 * adjGreen_font )  - ( 0.2126 * adjRed_font  ) )  / 0.0722;
    colorDataObj.fontRangeRed   = removeLuminanceMultiplier( fontRangeRed );
    colorDataObj.fontRangeGreen = removeLuminanceMultiplier( fontRangeGreen );
    colorDataObj.fontRangeBlue  = removeLuminanceMultiplier( fontRangeBlue );

    // get bg range values second
    var adjRed_bg    = useLuminanceMultiplier(colorDataObj.bgColors.r);
    var adjGreen_bg  = useLuminanceMultiplier(colorDataObj.bgColors.g);
    var adjBlue_bg   = useLuminanceMultiplier(colorDataObj.bgColors.b);
    var bgRangeRed    = ( colorDataObj.lesserLumTarget - ( 0.7152 * adjGreen_bg )  - ( 0.0722 * adjBlue_bg ) )  / 0.2126;
    var bgRangeGreen  = ( colorDataObj.lesserLumTarget - ( 0.2126 * adjRed_bg   )  - ( 0.0722 * adjBlue_bg ) )  / 0.7152;
    var bgRangeBlue   = ( colorDataObj.lesserLumTarget - ( 0.7152 * adjGreen_bg )  - ( 0.2126 * adjRed_bg  ) )  / 0.0722;
    colorDataObj.bgRangeRed   = removeLuminanceMultiplier( bgRangeRed );
    colorDataObj.bgRangeGreen = removeLuminanceMultiplier( bgRangeGreen );
    colorDataObj.bgRangeBlue  = removeLuminanceMultiplier( bgRangeBlue );
  }

  else if(colorDataObj.brighterColorIs == 'bg' && colorDataObj.targetContrast != 0 ) {
    // get font range values first
    var adjRed_font    = useLuminanceMultiplier(colorDataObj.fontColors.r);
    var adjGreen_font  = useLuminanceMultiplier(colorDataObj.fontColors.g);
    var adjBlue_font   = useLuminanceMultiplier(colorDataObj.fontColors.b);
    var fontRangeRed    = ( colorDataObj.lesserLumTarget - ( 0.7152 * adjGreen_font )  - ( 0.0722 * adjBlue_font ) )  / 0.2126;
    var fontRangeGreen  = ( colorDataObj.lesserLumTarget - ( 0.2126 * adjRed_font   )  - ( 0.0722 * adjBlue_font ) )  / 0.7152;
    var fontRangeBlue   = ( colorDataObj.lesserLumTarget - ( 0.7152 * adjGreen_font )  - ( 0.2126 * adjRed_font  ) )  / 0.0722;
    colorDataObj.fontRangeRed   = removeLuminanceMultiplier( fontRangeRed );
    colorDataObj.fontRangeGreen = removeLuminanceMultiplier( fontRangeGreen );
    colorDataObj.fontRangeBlue  = removeLuminanceMultiplier( fontRangeBlue );

    // get bg range values second
    var adjRed_bg    = useLuminanceMultiplier(colorDataObj.bgColors.r);
    var adjGreen_bg  = useLuminanceMultiplier(colorDataObj.bgColors.g);
    var adjBlue_bg   = useLuminanceMultiplier(colorDataObj.bgColors.b);
    var bgRangeRed    = ( colorDataObj.greaterLumTarget - ( 0.7152 * adjGreen_bg )  - ( 0.0722 * adjBlue_bg ) )  / 0.2126;
    var bgRangeGreen  = ( colorDataObj.greaterLumTarget - ( 0.2126 * adjRed_bg   )  - ( 0.0722 * adjBlue_bg ) )  / 0.7152;
    var bgRangeBlue   = ( colorDataObj.greaterLumTarget - ( 0.7152 * adjGreen_bg )  - ( 0.2126 * adjRed_bg  ) )  / 0.0722;
    colorDataObj.bgRangeRed   = removeLuminanceMultiplier( bgRangeRed );
    colorDataObj.bgRangeGreen = removeLuminanceMultiplier( bgRangeGreen );
    colorDataObj.bgRangeBlue  = removeLuminanceMultiplier( bgRangeBlue );
  }
  else { // assumes colorDataObj.targetContrast = 0
    colorDataObj.fontRangeRed   = 0;
    colorDataObj.fontRangeGreen = 0;
    colorDataObj.fontRangeBlue  = 0;
    colorDataObj.bgRangeRed     = 0;
    colorDataObj.bgRangeGreen   = 0;
    colorDataObj.bgRangeBlue    = 0;
  }
  return colorDataObj;
}


function setRangesForUI( colorDataObj ) {
  if(colorDataObj.brighterColorIs == 'font' && colorDataObj.targetContrast != 0) {

    $('#cp_font-color-settings .cp_color-settings_a11y-fail-range').eq(0)
      .attr('data-fail-value', normalizeRange(colorDataObj.fontRangeRed))
      .css('width', (normalizeRange(colorDataObj.fontRangeRed)) + 'px')
      .css('right', '');
    $('#cp_font-color-settings .cp_color-settings_a11y-fail-range').eq(1)
      .attr('data-fail-value', normalizeRange(colorDataObj.fontRangeGreen))
      .css('width', (normalizeRange(colorDataObj.fontRangeGreen)) + 'px')
      .css('right', '');
    $('#cp_font-color-settings .cp_color-settings_a11y-fail-range').eq(2)
      .attr('data-fail-value', normalizeRange(colorDataObj.fontRangeBlue))
      .css('width', (normalizeRange(colorDataObj.fontRangeBlue)) + 'px')
      .css('right', '');

    $('#cp_background-color-settings .cp_color-settings_a11y-fail-range').eq(0)
      .attr('data-fail-value', 260 - normalizeRange(colorDataObj.bgRangeRed))
      .css('width', (260 - normalizeRange(colorDataObj.bgRangeRed)) + 'px')
      .css('right', '105px');
    $('#cp_background-color-settings .cp_color-settings_a11y-fail-range').eq(1)
      .attr('data-fail-value', 260 - normalizeRange(colorDataObj.bgRangeGreen))
      .css('width', (260 - normalizeRange(colorDataObj.bgRangeGreen)) + 'px')
      .css('right', '105px');
    $('#cp_background-color-settings .cp_color-settings_a11y-fail-range').eq(2)
      .attr('data-fail-value', 260 - normalizeRange(colorDataObj.bgRangeBlue))
      .css('width', (260 - normalizeRange(colorDataObj.bgRangeBlue)) + 'px')
      .css('right', '105px');
    $('.cp_color-settings_a11y-fail-range')
      .removeClass('hide')
      .each(function() {
        var self = $(this);
        if(self.css('width') == '26px') self.addClass('hide'); // needed for all cases where no value applies.
      });
  }

  if(colorDataObj.brighterColorIs == 'bg' && colorDataObj.targetContrast != 0) {
    $('#cp_background-color-settings .cp_color-settings_a11y-fail-range').eq(0)
      .attr('data-fail-value', normalizeRange(colorDataObj.bgRangeRed))
      .css('width', (normalizeRange(colorDataObj.bgRangeRed)) + 'px')
      .css('right', '');
    $('#cp_background-color-settings .cp_color-settings_a11y-fail-range').eq(1)
      .attr('data-fail-value', normalizeRange(colorDataObj.bgRangeGreen))
      .css('width', (normalizeRange(colorDataObj.bgRangeGreen)) + 'px')
      .css('right', '');
    $('#cp_background-color-settings .cp_color-settings_a11y-fail-range').eq(2)
      .attr('data-fail-value', normalizeRange(colorDataObj.bgRangeBlue))
      .css('width', (normalizeRange(colorDataObj.bgRangeBlue)) + 'px')
      .css('right', '');

    $('#cp_font-color-settings .cp_color-settings_a11y-fail-range').eq(0)
      .attr('data-fail-value', 260 - normalizeRange(colorDataObj.fontRangeRed))
      .css('width', (260 - normalizeRange(colorDataObj.fontRangeRed)) + 'px')
      .css('right', '105px');
    $('#cp_font-color-settings .cp_color-settings_a11y-fail-range').eq(1)
      .attr('data-fail-value', 260 - normalizeRange(colorDataObj.fontRangeGreen))
      .css('width', (260 - normalizeRange(colorDataObj.fontRangeGreen)) + 'px')
      .css('right', '105px');
    $('#cp_font-color-settings .cp_color-settings_a11y-fail-range').eq(2)
      .attr('data-fail-value', 260 - normalizeRange(colorDataObj.fontRangeBlue))
      .css('width', (260 - normalizeRange(colorDataObj.fontRangeBlue)) + 'px')
      .css('right', '105px');
    $('.cp_color-settings_a11y-fail-range')
      .removeClass('hide')
      .each(function() {
        var self = $(this);
        if(self.css('width') == '26px') self.addClass('hide'); // needed for all cases where no value applies.
      });

  }
  else if(colorDataObj.targetContrast == 0){ // assumes colorDataObj.targetContrast == 0
    $('.cp_color-settings_a11y-fail-range').addClass('hide');
  }

  function normalizeRange( rangeValue ) {
    if(rangeValue > 255) return 255;
    if(rangeValue < 0) return 0;
    return rangeValue;
  }

}


// Colorblindness Toggle

function setupCBtoggle() {
  var toggleButton_forColorblindness = $('#toggle-btn-colorblindness');

  $('#cp_sample-content')
    .on('mouseover', function() {
      var self = $(this);
      var swatchBg = $('#cp_background-swatch'), swatchFont = $('#cp_font-swatch');
      var currentColorblindness = $('#cp_colorblindness-filter-button').attr('data-filter-state');
      if(currentColorblindness && currentColorblindness != 'normal') {
        var cbFunc = Object.byString(fBlind, currentColorblindness);
        var cbColor = cbFunc([ $('#cp_slider_font_first-value').val(), $('#cp_slider_font_second-value').val(), $('#cp_slider_font_third-value').val() ])
        var cbBgColor = cbFunc([ $('#cp_slider_bg_first-value').val(), $('#cp_slider_bg_second-value').val(), $('#cp_slider_bg_third-value').val() ])
        self
          .attr('data-css-color', self.css('color'))
          .attr('data-css-bgcolor', self.css('background-color'));
        swatchFont.attr('data-css-bgcolor', swatchFont.css('background-color'));
        swatchBg.attr('data-css-bgcolor', swatchBg.css('background-color'));
        self
          .css('color',             'rgb(' + cbColor[0] + ',' + cbColor[1] + ',' + cbColor[2] )
          .css('background-color',  'rgb(' + cbBgColor[0] + ',' + cbBgColor[1] + ',' + cbBgColor[2] );
        swatchFont.css('background-color', 'rgb(' + cbColor[0] + ',' + cbColor[1] + ',' + cbColor[2] );
        swatchBg.css('background-color',  'rgb(' + cbBgColor[0] + ',' + cbBgColor[1] + ',' + cbBgColor[2] );
      }
    })
    .on('mouseout', function() {
      var self = $(this), swatchBg = $('#cp_background-swatch'), swatchFont = $('#cp_font-swatch');
      
      self
        .css('color', self.attr('data-css-color'))
        .css('background-color', self.attr('data-css-bgcolor'));
      swatchFont.css('background-color', swatchFont.attr('data-css-bgcolor'));
      swatchBg.css('background-color', swatchBg.attr('data-css-bgcolor'));
      
    })

  toggleButton_forColorblindness
    .bind('mouseover', function() {
      
      var currentColorblindness = $('#cp_colorblindness-filter-button').attr('data-filter-state');
      
      var redValue_font = $('#cp_slider_font_first-value').val();
      var greenValue_font = $('#cp_slider_font_second-value').val();
      var blueValue_font = $('#cp_slider_font_third-value').val();

      var redValue_bg = $('#cp_slider_bg_first-value').val();
      var greenValue_bg = $('#cp_slider_bg_second-value').val();
      var blueValue_bg = $('#cp_slider_bg_third-value').val();

      var fontColorInHex, bgColorsInHex;
      if(currentColorblindness == 'normal' || !currentColorblindness) {
        fontColorInHex  = rgbToHex(redValue_font,greenValue_font,blueValue_font); 
        bgColorInHex    = rgbToHex(redValue_bg,greenValue_bg,blueValue_bg); 
      } else {
        var cbFunc = Object.byString(fBlind,currentColorblindness);
        fontColorInHex  = cbFunc([redValue_font, greenValue_font,  blueValue_font]); 
        bgColorInHex    = cbFunc([redValue_bg,   greenValue_bg,    blueValue_bg]); 
      }

      console.log('currentColorblindness : ' + currentColorblindness);
      console.log('fontColorInHex : ' + fontColorInHex);
      console.log('bgColorInHex : ' + bgColorInHex);
      // var colorResult = blindMK({ 50, 100, 150 }, currentColorblindness);

    })
    .bind('click', function() {
      var self = $(this);
      self
        .toggleClass('toggle-on')
        .toggleClass('toggle-off');
      if(self.hasClass('toggle-on')) {

      } else if(self.hasClass('toggle-off')) {

      }
    });
}


function resetAllFilters() {
  
  colorDataObj.currentActiveTool      = 'off';
  var contrastMenu = $('#cp_contrast-range-filter-button-group');
  contrastMenu
    .find('#cp_range-filter-button')
      .attr('data-filter-state', 'off')
      .html('<span class="fa fa-adjust"></span> Contrast Range Filter <span class="caret"></span>');
  contrastMenu
    .find('ul a.selected').removeClass('selected')
    .parent().parent()
    .find('ul a.off').addClass('selected');


  colorDataObj.colorblindActiveFilter = 'normal';
  var colorblindMenu = $('#cp_colorblindness-filter-button-group');
  colorblindMenu
    .find('#cp_colorblindness-filter-button').attr('data-filter-state', 'normal')
    .html('<span class="fa fa-adjust"></span> Colorblindness Filter <span class="caret"></span>');    
  colorblindMenu  
    .find('ul a.selected').removeClass('selected')
    .parent().parent()
    .find('ul a.off').addClass('selected');

}


// function update




//  *******  START Colorblindness Conversions ********* //

/*

    The Color Blind Simulation function is
    copyright (c) 2000-2001 by Matthew Wickline and the
    Human-Computer Interaction Resource Network ( http://hcirn.com/ ).
    
    It is used with the permission of Matthew Wickline and HCIRN,
    and is freely available for non-commercial use. For commercial use, please
    contact the Human-Computer Interaction Resource Network ( http://hcirn.com/ ).

*/


            

// example : blindMK({ 50, 100, 150 }, 'protan')

var rBlind={'protan':{'cpu':0.735,'cpv':0.265,'am':1.273463,'ayi':-0.073894},
            'deutan':{'cpu':1.14,'cpv':-0.14,'am':0.968437,'ayi':0.003331},
            'tritan':{'cpu':0.171,'cpv':-0.003,'am':0.062921,'ayi':0.292119}};

var fBlind={'normal'        :function(v) { return(v); },
            'protanopia'    :function(v) { return(blindMK(v,'protan')); },
            'protanomaly'   :function(v) { return(anomylize(v,blindMK(v,'protan'))); },
            'deuteranopia'  :function(v) { return(blindMK(v,'deutan')); },
            'deuteranomaly' :function(v) { return(anomylize(v,blindMK(v,'deutan'))); },
            'tritanopia'    :function(v) { return(blindMK(v,'tritan')); },
            'tritanomaly'   :function(v) { return(anomylize(v,blindMK(v,'tritan'))); },
            'achromatopsia' :function(v) { return(monochrome(v)); },
            'achromatomaly' :function(v) { return(anomylize(v,monochrome(v))); }};

function blindMK(r,t) { var gamma=2.2, wx=0.312713, wy=0.329016, wz=0.358271;

    function Color() { this.rgb_from_xyz=xyz2rgb; this.xyz_from_rgb=rgb2xyz; }

    var b=r[2], g=r[1], r=r[0], c=new Color;
    
    c.r=Math.pow(r/255,gamma); c.g=Math.pow(g/255,gamma); c.b=Math.pow(b/255,gamma); c.xyz_from_rgb();

    var sum_xyz=c.x+c.y+c.z; c.u=0; c.v=0;
    
    if(sum_xyz!=0) { c.u=c.x/sum_xyz; c.v=c.y/sum_xyz; }

    var nx=wx*c.y/wy, nz=wz*c.y/wy, clm, s=new Color(), d=new Color(); d.y=0;
    
    if(c.u<rBlind[t].cpu) { clm=(rBlind[t].cpv-c.v)/(rBlind[t].cpu-c.u); } else { clm=(c.v-rBlind[t].cpv)/(c.u-rBlind[t].cpu); }

    var clyi=c.v-c.u*clm; d.u=(rBlind[t].ayi-clyi)/(clm-rBlind[t].am); d.v=(clm*d.u)+clyi;

    s.x=d.u*c.y/d.v; s.y=c.y; s.z=(1-(d.u+d.v))*c.y/d.v; s.rgb_from_xyz();

    d.x=nx-s.x; d.z=nz-s.z; d.rgb_from_xyz();

    var adjr=d.r?((s.r<0?0:1)-s.r)/d.r:0, adjg=d.g?((s.g<0?0:1)-s.g)/d.g:0, adjb=d.b?((s.b<0?0:1)-s.b)/d.b:0;

    var adjust=Math.max(((adjr>1||adjr<0)?0:adjr), ((adjg>1||adjg<0)?0:adjg), ((adjb>1||adjb<0)?0:adjb));

    s.r=s.r+(adjust*d.r); s.g=s.g+(adjust*d.g); s.b=s.b+(adjust*d.b);
    
    function z(v) { return(255*(v<=0?0:v>=1?1:Math.pow(v,1/gamma))); }

    var returnObject = {};
    returnObject.r = Math.round(z(s.r));
    returnObject.g = Math.round(z(s.g));
    returnObject.b = Math.round(z(s.b));

    return([ Math.round(z(s.r)), Math.round(z(s.g)), Math.round(z(s.b)) ]);
    // return returnObject;
}

function rgb2xyz() {

    this.x=(0.430574*this.r+0.341550*this.g+0.178325*this.b);
    this.y=(0.222015*this.r+0.706655*this.g+0.071330*this.b);
    this.z=(0.020183*this.r+0.129553*this.g+0.939180*this.b);

    return this;

}

function xyz2rgb() {

    this.r=( 3.063218*this.x-1.393325*this.y-0.475802*this.z);
    this.g=(-0.969243*this.x+1.875966*this.y+0.041555*this.z);
    this.b=( 0.067871*this.x-0.228834*this.y+1.069251*this.z);

    return this;

}

function anomylize(a,b) { var v=1.75, d=v*1+1;

    return([Math.round((v*b[0]+a[0]*1)/d), Math.round((v*b[1]+a[1]*1)/d), Math.round((v*b[2]+a[2]*1)/d)]);

}

function monochrome(r) { var z=Math.round(r[0]*.299+r[1]*.587+r[2]*.114); return([z,z,z]); }

// ********* END Colorblindness Conversions *********** //





