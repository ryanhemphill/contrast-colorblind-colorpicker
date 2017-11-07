// contrast-colorblind-colorpicker.js


// START Utilities 


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
  
  setTimeout(function () { $('.cp_slider-textfield').first().trigger('change'); }, 5);
  
  colorDataObj = pullValuesFromRgbTexfields( colorDataObj );
 
  function pullValuesFromRgbTexfields() {
    
    var fontRed   = Number($('#cp_font-color-settings .cp_slider-textfield').eq(0).val());
    var fontGreen = Number($('#cp_font-color-settings .cp_slider-textfield').eq(1).val());
    var fontBlue  = Number($('#cp_font-color-settings .cp_slider-textfield').eq(2).val());
    var fontAlpha = Number($('#cp_font-color-settings .cp_slider-textfield').eq(3).val()) * .01;
    var fontHEX = rgbToHex(fontRed, fontGreen, fontBlue);

    var bgRed = Number($('#cp_background-color-settings .cp_slider-textfield').eq(0).val());
    var bgGreen = Number($('#cp_background-color-settings .cp_slider-textfield').eq(1).val());
    var bgBlue = Number($('#cp_background-color-settings .cp_slider-textfield').eq(2).val());
    var bgHEX = rgbToHex(bgRed, bgGreen, bgBlue);

    colorDataObj.fontColors = {};
    colorDataObj.fontColors.r = fontRed;
    colorDataObj.fontColors.g = fontGreen;
    colorDataObj.fontColors.b = fontBlue;
    colorDataObj.fontColors.a = fontAlpha;
    colorDataObj.fontColorsInHex = fontHEX;

    

    colorDataObj.bgColors = {};
    colorDataObj.bgColors.r = bgRed;
    colorDataObj.bgColors.g = bgGreen;
    colorDataObj.bgColors.b = bgBlue;

    colorDataObj.bgColorsInHex = bgHEX;
    
    colorDataObj.fontColorSansAlpha = convertRGBwithAlphaChannel(colorDataObj.fontColors, colorDataObj.bgColors);

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

  // setSampleArea( colorDataObj.fontColorInHex, colorDataObj.bgColorInHex );
  setSampleArea( colorDataObj.fontColors, colorDataObj.bgColors );
  

  setupCBtoggle();

  enableConvertToRGBSansAlpha( '.convert-sans-alpha-button' );

  function setMarkerColor( whichMarkers, colorValue ) {
    if(typeof colorValue === 'string') { colorValue = hexToRgb(colorValue); }
    colorValue['a'] = 1; 
    if(whichMarkers == 'font')       $('#cp_font-color-settings .cp_color-settings_marker-color').css('background-color', "rgba("+colorValue.r +','+colorValue.g+','+colorValue.b+','+colorValue.a+')');
    if(whichMarkers == 'background') $('#cp_background-color-settings .cp_color-settings_marker-color').css('background-color', "rgba("+colorValue.r +','+colorValue.g+','+colorValue.b+','+colorValue.a+')');
    if(whichMarkers == 'font')       $('#cp_font-color-settings .cp_color-settings_marker-color').css('background-color', "rgb("+colorDataObj.fontColorSansAlpha.r +','+colorDataObj.fontColorSansAlpha.g+','+colorDataObj.fontColorSansAlpha.b+')');
    // if(whichMarkers == 'background') $('#cp_background-color-settings .cp_color-settings_marker-color').css('background-color', "rgba("+colorValue.r +','+colorValue.g+','+colorValue.b+','+colorValue.a+')');
  }

  function setSampleArea( fontColorValue, backgroundColorValue ) {
    if(typeof fontColorValue        === 'string') { fontColorValue        = hexToRgb(fontColorValue); }
    if(typeof backgroundColorValue  === 'string') { backgroundColorValue  = hexToRgb(backgroundColorValue); }
    if(!fontColorValue.a && fontColorValue.a != 0){ fontColorValue.a      = 100 ;}
    var fontColorString = "rgba("+fontColorValue.r +','+fontColorValue.g+','+fontColorValue.b+','+(fontColorValue.a * 0.01)+')';
    var bgColorString   = "rgb("+backgroundColorValue.r +','+backgroundColorValue.g+','+backgroundColorValue.b+')';
    $('#cp_sample-content')
      .css('color',            fontColorString)
      .css('background-color', bgColorString);
    $('#cp_font-swatch').css('background-color', fontColorString);
    $('#cp_background-swatch').css('background-color', bgColorString);
    // note - by converting the rgba font color to a rgb value set, it makes closestMatch still accurate
    var fontColorSansAlpha  = convertRGBwithAlphaChannel(fontColorValue, backgroundColorValue);
    var fontColorName       = findClosestColorRGB(fontColorSansAlpha);
    var backgroundColorName = findClosestColorRGB(backgroundColorValue);
    $('#font-color-name').find('.color-name')
      .attr('data-colorname', fontColorName)
      .html(convertColorNameToReadable(fontColorName));
    $('#background-color-name').find('.color-name')
      .attr('data-colorname', backgroundColorName)
      .html(convertColorNameToReadable(backgroundColorName));
    updateConvertRGBSansAlphaButton( '#cp_font-color-settings', colorDataObj.fontColorSansAlpha);
    updateConvertRGBSansAlphaButton( '#cp_background-color-settings', colorDataObj.bgColors);
  }



  // function setMarkerPlacement( colorDataObj ) {}
  moveMarker( $('#cp_font-color-settings .cp_color-settings_slide-marker').eq(0), colorDataObj.fontColors.r );
  moveMarker( $('#cp_font-color-settings .cp_color-settings_slide-marker').eq(1), colorDataObj.fontColors.g );
  moveMarker( $('#cp_font-color-settings .cp_color-settings_slide-marker').eq(2), colorDataObj.fontColors.b );
  moveMarker( $('#cp_font-color-settings .cp_color-settings_slide-marker').eq(3), colorDataObj.fontColors.a, 255 );
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
      
      // setSampleArea( colorDataObj.fontColorInHex, colorDataObj.bgColorInHex );
      setSampleArea( colorDataObj.fontColors, colorDataObj.bgColors );
    } else { // [ TASK - update with colorblindness toggle feature ]
      
      // setSampleArea( colorDataObj.fontColorInHex, colorDataObj.bgColorInHex );
      setSampleArea( colorDataObj.fontColors, colorDataObj.bgColors );
    }
    
    var contrastUpdateString = colorDataObj.currentContrast;  
    contrastUpdateString = parseInt(contrastUpdateString.toFixed(2));

    if(colorDataObj.targetContrast != 0) {
      if(colorDataObj.targetContrast >= colorDataObj.currentContrast) contrastUpdateString = contrastUpdateString + ':1 Contrast, Fails Filter <span class="fa fa-ban" style="color:red;"></span>'
      if(colorDataObj.targetContrast <  colorDataObj.currentContrast) contrastUpdateString = contrastUpdateString + ':1 Contrast, Passes Filter <span class="fa fa-check" style="color:green;"></span>'
    }
    else if(colorDataObj.targetContrast == 0) {
      if(contrastUpdateString < 3) contrastUpdateString = contrastUpdateString + ', Fails all WCAG 2.0 Criteria <span class="fa fa-ban" style="color:red;"></span>';
      if(contrastUpdateString >= 3 && contrastUpdateString < 4.5) contrastUpdateString = contrastUpdateString + ', AA large text only <span class="fa fa-check" style="color:green;"></span>';
      if(contrastUpdateString >= 4.5 && contrastUpdateString < 7) contrastUpdateString = contrastUpdateString + ', AAA large text & AA small <span class="fa fa-check" style="color:green;"></span>';
      if(contrastUpdateString >= 7) contrastUpdateString = contrastUpdateString + ', Pass: AAA small text <span class="fa fa-check" style="color:green;"></span>';
    }

    $('#cp_a11y-status-update').html(contrastUpdateString);

    var fontSliders = $('#cp_font-color-settings .cp_color-settings_slide').not('.cp_colorblind-split');
    buildCSSgradient(fontSliders.eq(0), 'red',    colorDataObj.fontColorInHex);
    buildCSSgradient(fontSliders.eq(1), 'green',  colorDataObj.fontColorInHex);
    buildCSSgradient(fontSliders.eq(2), 'blue',   colorDataObj.fontColorInHex);
    //updateCheckerboardPattern('#alpha-checkerboard-pattern', '#alpha-subcheckerboard-pattern', colorDataObj.fontColorInRGB, colorDataObj.bgInRGB)
    updateCheckerboardPattern('#alpha-checkerboard-pattern', '#alpha-subcheckerboard-pattern', colorDataObj.fontColors, colorDataObj.bgColors );

    var backgroundSliders = $('#cp_background-color-settings .cp_color-settings_slide').not('.cp_colorblind-split');
    buildCSSgradient( backgroundSliders.eq(0), 'red',   colorDataObj.bgColorInHex);
    buildCSSgradient( backgroundSliders.eq(1), 'green', colorDataObj.bgColorInHex);
    buildCSSgradient( backgroundSliders.eq(2), 'blue',  colorDataObj.bgColorInHex); 
    
    $('#font-luminosity-result').text( colorDataObj.fontLuminance   );
    $('#bg-luminosity-result').text(   colorDataObj.bgLuminance     );
    $('#current-contrast').text(       colorDataObj.currentContrast );

    if(colorDataObj.currentContrast < colorDataObj.contrastTarget) { $('.cp_color-settings_container').addClass('range-alert'); }
    if(colorDataObj.currentContrast > colorDataObj.contrastTarget) { $('.cp_color-settings_container').removeClass('range-alert'); }

    if(colorDataObj.currentActiveTool == 'contrast') { setRangesForUI( colorDataObj ); }

    if(colorDataObj.currentActiveTool == 'colorblindness') {
      colorDataObj.colorblindActiveFilter = $('#cp_colorblindness-filter-button').attr('data-filter-state');
      updateColorBlindnessGradient(colorDataObj.colorblindActiveFilter);
    }

    


    // START update analytics, if ready
    if (typeof updateAnalyticsTableValues == 'function') { 
      updateAnalyticsTableValues();
      updateAnalyticsTableState();
    } else {
      setTimeout(function() {
        if (typeof updateAnalyticsTableValues == 'function') { 
          updateAnalyticsTableValues();
          updateAnalyticsTableState();
        } 
      },1000);
    }
    //  END update analytics
  });  

});
$('.cp_color-settings_slide-marker, .cp_slider-textfield')
  .keydown(       function( event ) { event.stopImmediatePropagation(); stepNumber($(this),event);})

$('.cp_color-settings_slide-marker')
  .bind('keyup',  function(event) { 
    if(event.keyCode == 13) { // enter == 13
      setTimeout(function() { $('#cp_a11y-status-update').attr('aria-live', 'assertive'); }, 1);
      setTimeout(function() { $('#cp_a11y-status-update').attr('aria-live', 'off');       }, 1500);
    }
  })
  .each(function() { 
    var self = $(this); 
    var textFieldTarget = self.parent().find('.cp_slider-textfield'); 
    enableMarkerDrag(self, textFieldTarget); 
  });

function stepNumber( targetElement, passedEvent, newValue) {
  targetElement = $(targetElement);
  if(passedEvent) { var thisKeyCode = passedEvent.keyCode; }
  if(!passedEvent) { // for click events only...
    var textfieldElement = targetElement.parent().find('.cp_slider-textfield');
    textfieldElement
      .val(newValue)
      .attr('value', newValue)
      .trigger('change');
  }
  if(thisKeyCode >= 37 || thisKeyCode <= 40) {
    var targetElement, thisValue;
    
    // textfield behaviors...
    if(targetElement.hasClass('cp_slider-textfield')) {
      thisValue = Number(targetElement.val());
      var targetMarker = targetElement.parent().parent().find('.cp_color-settings_slide-marker');
      var maxValue = parseInt(targetMarker.attr('aria-valuemax'));
      var minValue = parseInt(targetMarker.attr('aria-valuemin'));
      newValue = parseInt(targetMarker.attr('aria-valuenow'));
      
      if(thisKeyCode == 38) {
        thisValue++;
        if(thisValue <= maxValue) {
          targetElement
            .val(thisValue)
            .attr('value', thisValue)
            .trigger('change');
          var xPosition = Number.parseInt( (255 * newValue / (maxValue-minValue)) + minValue );
          setTimeout(function () { targetElement.select(); }, 50);
          moveMarker( targetMarker, thisValue, xPosition );  
        }
        
      } 
      if(thisKeyCode == 40) {
        thisValue--;
        if(thisValue >= minValue) {
          targetElement
            .val(thisValue)
            .attr('value', thisValue)
            .trigger('change');
          setTimeout(function () { targetElement.select(); }, 50);
          var xPosition = Number.parseInt( (255 * newValue / (maxValue-minValue)) + minValue );
          // var targetMarker = targetElement.parent().parent().find('.cp_color-settings_slide-marker');
          moveMarker( targetMarker, thisValue, xPosition );
        }
        
      }
      if(thisKeyCode >= 48 && thisKeyCode <= 57 || thisKeyCode == 8 || thisKeyCode == 46 || thisKeyCode == 13) {
        setTimeout(function () { 
          thisValue = Number(targetElement.val());
          // var targetMarker = targetElement.parent().parent().find('.cp_color-settings_slide-marker');
          var xPosition = Number.parseInt( (255 * newValue / (maxValue-minValue)) + minValue );
          moveMarker( targetMarker, thisValue, xPosition );
         }, 50);
      }
    }
    // END textfield behaviors

    // START slider behaviors
    if(targetElement.hasClass('cp_color-settings_slide-marker')) {
      var targetMarker = targetElement;
      var maxValue = parseInt(targetMarker.attr('aria-valuemax'));
      var minValue = parseInt(targetMarker.attr('aria-valuemin'));
      var textfieldElement = targetElement.parent().parent().find('.cp_slider-textfield');

      // if left or alt-left (MacOS = fn+shift+up)...
      if(thisKeyCode == 39 || thisKeyCode == 33 && passedEvent.shiftKey == true) {
        thisValue = Number(textfieldElement.val());

        if(thisValue+1 <= maxValue) {
          thisValue++;
          var xPosition = Number.parseInt( (255 * thisValue / (maxValue-minValue)) + minValue );
      
          textfieldElement
            .val(thisValue)
            .attr('value', thisValue)
            .trigger('change');
          moveMarker( targetElement, thisValue, xPosition );
        }
      } 
      // if right or alt-right (MacOS = fn+shift+down)
      if(thisKeyCode == 37 || thisKeyCode == 34 && passedEvent.shiftKey == true) {
        thisValue = Number(textfieldElement.val());
        if(thisValue-1 >= minValue) {
          thisValue--;
          var xPosition = Number.parseInt( (255 * thisValue / (maxValue-minValue)) + minValue );
      
          textfieldElement
            .val(thisValue)
            .attr('value', thisValue)
            .trigger('change');
          moveMarker( targetElement, thisValue, xPosition );
        }  
      }
      // if pageUp
      if(thisKeyCode == 33 && passedEvent.shiftKey == false) { // MacOS > pageUp
        thisValue = Number(textfieldElement.val());
        if(thisValue +10 <= maxValue) { thisValue = thisValue+10; }
        else { thisValue = maxValue; }
        var xPosition = Number.parseInt( (255 * thisValue / (maxValue-minValue)) + minValue );
      
        textfieldElement
          .val(thisValue)
          .attr('value', thisValue)
          .trigger('change');
        moveMarker( targetElement, thisValue, xPosition );
      }
      // if pageDown
      if(thisKeyCode == 34 && passedEvent.shiftKey == false) { // MacOS > pageDown ()
        thisValue = Number(textfieldElement.val());
        if(thisValue -10 >= minValue) { thisValue = thisValue-10; }
        else { thisValue = minValue; }
        var xPosition = Number.parseInt( (255 * thisValue / (maxValue-minValue)) + minValue );
      
        textfieldElement
          .val(thisValue)
          .attr('value', thisValue)
          .trigger('change');
        moveMarker( targetElement, thisValue, xPosition );
      }
      // if Home
      if(thisKeyCode == 36) { // MacOS > Home (start of slider)
        thisValue = minValue;
        var xPosition = Number.parseInt( (255 * thisValue / (maxValue-minValue)) + minValue );
      
        textfieldElement
          .val(thisValue)
          .attr('value', thisValue)
          .trigger('change');
        moveMarker( targetElement, thisValue, xPosition );
      }
      // if End
      if(thisKeyCode == 35) { // MacOS > End (end of slider)
        thisValue = maxValue;
        var xPosition = Number.parseInt( (255 * thisValue / (maxValue-minValue)) + minValue );
      
        textfieldElement
          .val(thisValue)
          .attr('value', thisValue)
          .trigger('change');
        moveMarker( targetElement, thisValue, xPosition );
      }

    }
  }
} 

function moveMarker( targetMarker, newValue, xPosition ) { // 
  // get width
  if(!xPosition) xPosition = newValue;
  var minValue = parseInt(targetMarker.attr('aria-valuemin'));
  var maxValue = parseInt(targetMarker.attr('aria-valuemax'));
  if(newValue >= minValue && newValue <= maxValue) {
    var valueDiff = maxValue - minValue;
    var percentAsPixels = 256 * (newValue/maxValue);

    targetMarker
      // .css('transform', 'translate3d(' + xPosition + 'px, 0px, 0px)')
      .css('left', xPosition+ 'px') // update testing for draggabilly implementation
      .attr('aria-valuenow', newValue)
      .attr('aria-valuetext', targetMarker.attr('data-slider-text-before') + ' equals ' + newValue + targetMarker.attr('data-slider-text-after'));
  }
}

function enableConvertToRGBSansAlpha( targetButton ) {
  targetButton = $(targetButton);
  updateConvertRGBSansAlphaButton( targetButton );
  targetButton.click(function() {
    targetContainer = targetButton.parents('.cp_color-settings_container');
    var colorArg;
    if(targetContainer.attr('id')         == 'cp_font-color-settings') {
      colorArg = colorDataObj.fontColorRGBSansAlpha;
      if(!colorArg) { colorArg = convertRGBwithAlphaChannel(colorDataObj.fontColors, colorDataObj.bgColors ); }
    } else if(targetContainer.attr('id')  == 'cp_background-color-settings') {
      colorArg = colorDataObj.bgColors;
    }
    applyColorToRGB(targetContainer, colorArg);
  });
}

function updateConvertRGBSansAlphaButton( targetButton, fontColorRGBSansAlpha ) {
  targetButton = $(targetButton);
  if(!fontColorRGBSansAlpha) { fontColorRGBSansAlpha = colorDataObj.fontColorSansAlpha; }
  if(!fontColorRGBSansAlpha) { fontColorSansAlpha = convertRGBwithAlphaChannel(colorDataObj.fontColors, colorDataObj.bgColors); }
  targetButton.find('.convert-value').text('rgb('+fontColorRGBSansAlpha.r+','+fontColorRGBSansAlpha.g+','+fontColorRGBSansAlpha.b+')');
}

function enableClickDrag( targetGroup ) {
  targetGroup = $(targetGroup);
  targetGroup.each(function() {
    var thisSlide = $(this).find('.cp_color-settings_slide:not(.events-disabled)');
    thisSlide.click(function(e){
      var sliderBackground = $(this);
      var container         = sliderBackground.parent('.cp_color-settings_slider-container');
      var sliderMarker      = container.find('.cp_color-settings_slide-marker');
      var greatestValue     = parseInt(sliderMarker.attr('aria-valuemax'));
      var lowestValue       = parseInt(sliderMarker.attr('aria-valuemin')); 
      var sliderBgOffset    = sliderBackground.offset();
      var rel_X             = Math.round(e.pageX - sliderBgOffset.left -15);
      if(     rel_X > 255)  { rel_X = 255; } 
      else if(rel_X < 0)    { rel_X = 0;   }
      var relativeValue = Number.parseInt((rel_X/255 *(greatestValue-lowestValue)) + lowestValue);
      container.find('.cp_slider-textfield')
        .val(relativeValue)
        .attr('value', relativeValue)
        .trigger('change');
      moveMarker(sliderMarker, relativeValue, rel_X);
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


// old version

// function enableMarkerDrag( targetElement, targetTextField ) {
//   var slideMarker = Draggable.create(targetElement, {
//     type: 'x',
//     throwProps: false,
//     bounds: {minX:0, maxX:255},
//     onDrag: update
//   });

//   function update() {
//     var newValue = slideMarker[0].x;
//     var valueMin = parseInt(targetElement.attr('aria-valuemin'));
//     var valueMax = parseInt(targetElement.attr('aria-valuemax'));
//     var valueDiff = valueMax - valueMin;
//     var relativeValue = Number.parseInt(newValue/255 * valueDiff ); 
//     // division by 254 was chosen instead of 255 to insure that 100% of valuemax would translate 
//     stepNumber( targetTextField, null, relativeValue );
//   }
// }

function enableMarkerDrag(targetElement, targetTextfield) { 
  targetTextfield = $(targetTextfield);
  targetElement = $(targetElement);
  targetElement.each(function(index) {
    var thisSlider = $(this);
    var thisSlider_container = thisSlider.attr('data-slide-container');
    // make draggable 
    thisSlider
      .draggabilly({
        axis: 'x',
        containment: true
      })
      .click(function() {
        $(this).focus();
      })
      .on('dragMove', function(event, pointer) {
        var selfSlider      = $(this),
            dragData        = selfSlider.data('draggabilly'),
            posX            = dragData.position.x,
            targetTextField = selfSlider.parent().parent().find('.cp_slider-textfield');

        update(selfSlider, targetTextField);
        
        function update(targetElement, targetTextField) {
          var newValue = posX;
          var valueMin = parseInt(targetElement.attr('aria-valuemin'));
          var valueMax = parseInt(targetElement.attr('aria-valuemax'));
          var valueDiff = valueMax - valueMin;
          var relativeValue = Number.parseInt(newValue/255 * valueDiff ); 
          // division by 254 was chosen instead of 255 to insure that 100% of valuemax would translate 
          stepNumber( targetTextField, null, relativeValue );
        }
      });
  });
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
    
    // var desiredType = Object.byString( fBlind, targetState );
    var cbTypeAndAmount = cbTypeFilter(targetState);
    
    var red_left_forFont    = cbTranslate(                         0, colorDataObj.fontColorSansAlpha.g, colorDataObj.fontColorSansAlpha.b, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 
    var red_right_forFont   = cbTranslate(                       255, colorDataObj.fontColorSansAlpha.g, colorDataObj.fontColorSansAlpha.b, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 
    var green_left_forFont  = cbTranslate( colorDataObj.fontColorSansAlpha.r,                         0, colorDataObj.fontColorSansAlpha.b, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 
    var green_right_forFont = cbTranslate( colorDataObj.fontColorSansAlpha.r,                       255, colorDataObj.fontColorSansAlpha.b, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 
    var blue_left_forFont   = cbTranslate( colorDataObj.fontColorSansAlpha.r, colorDataObj.fontColorSansAlpha.g,                         0, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 
    var blue_right_forFont  = cbTranslate( colorDataObj.fontColorSansAlpha.r, colorDataObj.fontColorSansAlpha.g,                       255, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 

    var red_left_forBg      = cbTranslate(                       0, colorDataObj.bgColors.g, colorDataObj.bgColors.b, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 
    var red_right_forBg     = cbTranslate(                     255, colorDataObj.bgColors.g, colorDataObj.bgColors.b, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 
    var green_left_forBg    = cbTranslate( colorDataObj.bgColors.r,                       0, colorDataObj.bgColors.b, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 
    var green_right_forBg   = cbTranslate( colorDataObj.bgColors.r,                     255, colorDataObj.bgColors.b, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 
    var blue_left_forBg     = cbTranslate( colorDataObj.bgColors.r, colorDataObj.bgColors.g,                       0, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 
    var blue_right_forBg    = cbTranslate( colorDataObj.bgColors.r, colorDataObj.bgColors.g,                     255, cbTypeAndAmount.type, cbTypeAndAmount.amount ); 


    var fontColorblindnessFilterTargets = $('#cp_font-color-settings .cp_colorblind-split');
    var bgColorblindnessFilterTargets   = $('#cp_background-color-settings .cp_colorblind-split');

    fontColorblindnessFilterTargets.eq(0) // red
        .css('background', '-moz-linear-gradient(left, rgb('                           + red_left_forFont.r + ',' + red_left_forFont.g + ',' + red_left_forFont.b + ') 0%, rgb('                 + red_right_forFont.r+ ','  + red_right_forFont.g + ', ' + red_right_forFont.b + ') 100%)')
        .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + red_left_forFont.r + ',' + red_left_forFont.g + ',' + red_left_forFont.b + ')), color-stop(100%, rgb('  + red_right_forFont.r + ',' + red_right_forFont.g + ', ' + red_right_forFont.b + ')))')
        .css('background', '-webkit-linear-gradient(left, rgb('                        + red_left_forFont.r + ',' + red_left_forFont.g + ',' + red_left_forFont.b + ') 0%, rgb('                 + red_right_forFont.r + ',' + red_right_forFont.g + ', ' + red_right_forFont.b + ') 100%)')
        .css('background', '-o-linear-gradient(left, rgb('                             + red_left_forFont.r + ',' + red_left_forFont.g + ',' + red_left_forFont.b + ') 0%, rgb('                 + red_right_forFont.r + ',' + red_right_forFont.g + ', ' + red_right_forFont.b + ') 100%)')
        .css('background', '-ms-linear-gradient(left, rgb('                            + red_left_forFont.r + ',' + red_left_forFont.g + ',' + red_left_forFont.b + ') 0%, rgb('                 + red_right_forFont.r + ',' + red_right_forFont.g + ', ' + red_right_forFont.b + ') 100%)')
        .css('background', 'linear-gradient(to right, rgb('                            + red_left_forFont.r + ',' + red_left_forFont.g + ',' + red_left_forFont.b + ') 0%, rgb('                 + red_right_forFont.r + ',' + red_right_forFont.g + ', ' + red_right_forFont.b + ') 100%)');
    
    fontColorblindnessFilterTargets.eq(1) // green
        .css('background', '-moz-linear-gradient(left, rgb('                           + green_left_forFont.r + ',' + green_left_forFont.g + ',' + green_left_forFont.b + ') 0%, rgb('                 + green_right_forFont.r+ ','  + green_right_forFont.g + ', ' + green_right_forFont.b + ') 100%)')
        .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + green_left_forFont.r + ',' + green_left_forFont.g + ',' + green_left_forFont.b + ')), color-stop(100%, rgb('  + green_right_forFont.r + ',' + green_right_forFont.g + ', ' + green_right_forFont.b + ')))')
        .css('background', '-webkit-linear-gradient(left, rgb('                        + green_left_forFont.r + ',' + green_left_forFont.g + ',' + green_left_forFont.b + ') 0%, rgb('                 + green_right_forFont.r + ',' + green_right_forFont.g + ', ' + green_right_forFont.b + ') 100%)')
        .css('background', '-o-linear-gradient(left, rgb('                             + green_left_forFont.r + ',' + green_left_forFont.g + ',' + green_left_forFont.b + ') 0%, rgb('                 + green_right_forFont.r + ',' + green_right_forFont.g + ', ' + green_right_forFont.b + ') 100%)')
        .css('background', '-ms-linear-gradient(left, rgb('                            + green_left_forFont.r + ',' + green_left_forFont.g + ',' + green_left_forFont.b + ') 0%, rgb('                 + green_right_forFont.r + ',' + green_right_forFont.g + ', ' + green_right_forFont.b + ') 100%)')
        .css('background', 'linear-gradient(to right, rgb('                            + green_left_forFont.r + ',' + green_left_forFont.g + ',' + green_left_forFont.b + ') 0%, rgb('                 + green_right_forFont.r + ',' + green_right_forFont.g + ', ' + green_right_forFont.b + ') 100%)');
    
    fontColorblindnessFilterTargets.eq(2) // blue
        .css('background', '-moz-linear-gradient(left, rgb('                           + blue_left_forFont.r + ',' + blue_left_forFont.g + ',' + blue_left_forFont.b + ') 0%, rgb('                 + blue_right_forFont.r+ ','  + blue_right_forFont.g + ', ' + blue_right_forFont.b + ') 100%)')
        .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + blue_left_forFont.r + ',' + blue_left_forFont.g + ',' + blue_left_forFont.b + ')), color-stop(100%, rgb('  + blue_right_forFont.r + ',' + blue_right_forFont.g + ', ' + blue_right_forFont.b + ')))')
        .css('background', '-webkit-linear-gradient(left, rgb('                        + blue_left_forFont.r + ',' + blue_left_forFont.g + ',' + blue_left_forFont.b + ') 0%, rgb('                 + blue_right_forFont.r + ',' + blue_right_forFont.g + ', ' + blue_right_forFont.b + ') 100%)')
        .css('background', '-o-linear-gradient(left, rgb('                             + blue_left_forFont.r + ',' + blue_left_forFont.g + ',' + blue_left_forFont.b + ') 0%, rgb('                 + blue_right_forFont.r + ',' + blue_right_forFont.g + ', ' + blue_right_forFont.b + ') 100%)')
        .css('background', '-ms-linear-gradient(left, rgb('                            + blue_left_forFont.r + ',' + blue_left_forFont.g + ',' + blue_left_forFont.b + ') 0%, rgb('                 + blue_right_forFont.r + ',' + blue_right_forFont.g + ', ' + blue_right_forFont.b + ') 100%)')
        .css('background', 'linear-gradient(to right, rgb('                            + blue_left_forFont.r + ',' + blue_left_forFont.g + ',' + blue_left_forFont.b + ') 0%, rgb('                 + blue_right_forFont.r + ',' + blue_right_forFont.g + ', ' + blue_right_forFont.b + ') 100%)');
   
    bgColorblindnessFilterTargets.eq(0) // red
        .css('background', '-moz-linear-gradient(left, rgb('                           + red_left_forBg.r + ',' + red_left_forBg.g + ',' + red_left_forBg.b + ') 0%, rgb('                 + red_right_forBg.r+ ','  + red_right_forBg.g + ', ' + red_right_forBg.b + ') 100%)')
        .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + red_left_forBg.r + ',' + red_left_forBg.g + ',' + red_left_forBg.b + ')), color-stop(100%, rgb('  + red_right_forBg.r + ',' + red_right_forBg.g + ', ' + red_right_forBg.b + ')))')
        .css('background', '-webkit-linear-gradient(left, rgb('                        + red_left_forBg.r + ',' + red_left_forBg.g + ',' + red_left_forBg.b + ') 0%, rgb('                 + red_right_forBg.r + ',' + red_right_forBg.g + ', ' + red_right_forBg.b + ') 100%)')
        .css('background', '-o-linear-gradient(left, rgb('                             + red_left_forBg.r + ',' + red_left_forBg.g + ',' + red_left_forBg.b + ') 0%, rgb('                 + red_right_forBg.r + ',' + red_right_forBg.g + ', ' + red_right_forBg.b + ') 100%)')
        .css('background', '-ms-linear-gradient(left, rgb('                            + red_left_forBg.r + ',' + red_left_forBg.g + ',' + red_left_forBg.b + ') 0%, rgb('                 + red_right_forBg.r + ',' + red_right_forBg.g + ', ' + red_right_forBg.b + ') 100%)')
        .css('background', 'linear-gradient(to right, rgb('                            + red_left_forBg.r + ',' + red_left_forBg.g + ',' + red_left_forBg.b + ') 0%, rgb('                 + red_right_forBg.r + ',' + red_right_forBg.g + ', ' + red_right_forBg.b + ') 100%)');
    
    bgColorblindnessFilterTargets.eq(1) // green
        .css('background', '-moz-linear-gradient(left, rgb('                           + green_left_forBg.r + ',' + green_left_forBg.g + ',' + green_left_forBg.b + ') 0%, rgb('                 + green_right_forBg.r+ ','  + green_right_forBg.g + ', ' + green_right_forBg.b + ') 100%)')
        .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + green_left_forBg.r + ',' + green_left_forBg.g + ',' + green_left_forBg.b + ')), color-stop(100%, rgb('  + green_right_forBg.r + ',' + green_right_forBg.g + ', ' + green_right_forBg.b + ')))')
        .css('background', '-webkit-linear-gradient(left, rgb('                        + green_left_forBg.r + ',' + green_left_forBg.g + ',' + green_left_forBg.b + ') 0%, rgb('                 + green_right_forBg.r + ',' + green_right_forBg.g + ', ' + green_right_forBg.b + ') 100%)')
        .css('background', '-o-linear-gradient(left, rgb('                             + green_left_forBg.r + ',' + green_left_forBg.g + ',' + green_left_forBg.b + ') 0%, rgb('                 + green_right_forBg.r + ',' + green_right_forBg.g + ', ' + green_right_forBg.b + ') 100%)')
        .css('background', '-ms-linear-gradient(left, rgb('                            + green_left_forBg.r + ',' + green_left_forBg.g + ',' + green_left_forBg.b + ') 0%, rgb('                 + green_right_forBg.r + ',' + green_right_forBg.g + ', ' + green_right_forBg.b + ') 100%)')
        .css('background', 'linear-gradient(to right, rgb('                            + green_left_forBg.r + ',' + green_left_forBg.g + ',' + green_left_forBg.b + ') 0%, rgb('                 + green_right_forBg.r + ',' + green_right_forBg.g + ', ' + green_right_forBg.b + ') 100%)');
    
    bgColorblindnessFilterTargets.eq(2) // blue
        .css('background', '-moz-linear-gradient(left, rgb('                           + blue_left_forBg.r + ',' + blue_left_forBg.g + ',' + blue_left_forBg.b + ') 0%, rgb('                 + blue_right_forBg.r+ ','  + blue_right_forBg.g + ', ' + blue_right_forBg.b + ') 100%)')
        .css('background', '-webkit-gradient(left top, right top, color-stop(0%, rgb(' + blue_left_forBg.r + ',' + blue_left_forBg.g + ',' + blue_left_forBg.b + ')), color-stop(100%, rgb('  + blue_right_forBg.r + ',' + blue_right_forBg.g + ', ' + blue_right_forBg.b + ')))')
        .css('background', '-webkit-linear-gradient(left, rgb('                        + blue_left_forBg.r + ',' + blue_left_forBg.g + ',' + blue_left_forBg.b + ') 0%, rgb('                 + blue_right_forBg.r + ',' + blue_right_forBg.g + ', ' + blue_right_forBg.b + ') 100%)')
        .css('background', '-o-linear-gradient(left, rgb('                             + blue_left_forBg.r + ',' + blue_left_forBg.g + ',' + blue_left_forBg.b + ') 0%, rgb('                 + blue_right_forBg.r + ',' + blue_right_forBg.g + ', ' + blue_right_forBg.b + ') 100%)')
        .css('background', '-ms-linear-gradient(left, rgb('                            + blue_left_forBg.r + ',' + blue_left_forBg.g + ',' + blue_left_forBg.b + ') 0%, rgb('                 + blue_right_forBg.r + ',' + blue_right_forBg.g + ', ' + blue_right_forBg.b + ') 100%)')
        .css('background', 'linear-gradient(to right, rgb('                            + blue_left_forBg.r + ',' + blue_left_forBg.g + ',' + blue_left_forBg.b + ') 0%, rgb('                 + blue_right_forBg.r + ',' + blue_right_forBg.g + ', ' + blue_right_forBg.b + ') 100%)');
    
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


  // new UI for contrast elements...
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



function defineGreaterLuminance( fontColorSample, bgColorSample, fontColorSansAlpha ) {
  var fontColorObj  = hexToRgb( fontColorSample );
  var bgColorObj    = hexToRgb( bgColorSample );
  var fontColorLuminance            = calcLuminance( fontColorObj.r, fontColorObj.g, fontColorObj.b );
  var bgColorLuminance              = calcLuminance( bgColorObj.r, bgColorObj.g, bgColorObj.b );
  if(fontColorSansAlpha) {
    var fontColorLuminanceSansAlpha = calcLuminance( fontColorSansAlpha.r, fontColorSansAlpha.g, fontColorSansAlpha.b );
  }
  var greaterLuminanceValue = function() {
    if(fontColorLuminance > bgColorLuminance) return 'font';
    if(fontColorLuminance < bgColorLuminance) return 'bg';
    else return 'equal';
  }
  if(fontColorSansAlpha) {
    var greaterLuminanceValueSansAlpha = function() {
      if(fontColorLuminance > bgColorLuminance) return 'font';
      if(fontColorLuminance < bgColorLuminance) return 'bg';
      else return 'equal';
    }
  }
  var returnObject = {};
  returnObject.fontColorObj = fontColorObj;
  returnObject.bgColorObj   = bgColorObj;
  returnObject.fontLum      = fontColorLuminance;
  returnObject.bgLum        = bgColorLuminance;
  returnObject.greaterLum   = greaterLuminanceValue;
  if(fontColorSansAlpha) {
    returnObject.fontLumSansAlpha     = fontColorLuminanceSansAlpha;
    returnObject.greaterLumSansAlpha  = greaterLuminanceValueSansAlpha;
  }
  return returnObject;
}


function initColorAnalysis( colorDataObj ) {
  // get colors in hex - this is because hex is the simplest means to translate to different color formats
  

  if(!colorDataObj.targetContrast) colorDataObj.targetContrast = 0;
  // colorDataObj.targetContrast = targetContrast;
  
  var fontRed             = Number($('#cp_slider_font_first-value').val()); 
  var fontGreen           = Number($('#cp_slider_font_second-value').val()); 
  var fontBlue            = Number($('#cp_slider_font_third-value').val()); 
  var fontAlpha           = Number($('#cp_slider_font_fourth-value').val());
  var fontInRGBA          = { r: fontRed, g: fontGreen, b: fontBlue, a: fontAlpha }; 
  var fontColorInHex      = rgbToHex( fontRed, fontGreen, fontBlue );
  var bgRed               = Number($('#cp_slider_bg_first-value').val()); 
  var bgGreen             = Number($('#cp_slider_bg_second-value').val()); 
  var bgBlue              = Number($('#cp_slider_bg_third-value').val()); 
  var bgInRGB             = { r: bgRed, g: bgGreen, b: bgBlue };
  var bgColorInHex        = rgbToHex( bgRed, bgGreen, bgBlue );
  
  colorDataObj = buildColorDataObject( fontInRGBA, bgInRGB, fontColorInHex, bgColorInHex, colorDataObj );
  // colorDataObj.currentContrast = calcContrast( colorDataObj );
  colorDataObj.currentContrast = calcContrast( colorDataObj.brighterColorIs, colorDataObj.fontLuminance, colorDataObj.bgLuminance );

  if(colorDataObj.targetContrast != 0) {

    $('#target-contrast').text(colorDataObj.targetContrast);

    if(colorDataObj.brighterColorIs == 'font') colorDataObj = calcRequiredLuminance( colorDataObj.fontLuminance, colorDataObj.bgLuminance, colorDataObj.targetContrast, colorDataObj );
    if(colorDataObj.brighterColorIs == 'bg'  ) colorDataObj = calcRequiredLuminance( colorDataObj.bgLuminance, colorDataObj.fontLuminance, colorDataObj.targetContrast, colorDataObj );
    
    if(colorDataObj.currentActiveTool == 'contrast') {
      colorDataObj = getContrastRangeValues( colorDataObj );
      setRangesForUI( colorDataObj );
    }
  }

  colorDataObj.currentContrast_noRed    = calcContrast( colorDataObj.noRed_brighterColorIs,     colorDataObj.noRedRGB_fontLuminance,    colorDataObj.noRedRGB_bgLuminance     );
  colorDataObj.currentContrast_lowRed   = calcContrast( colorDataObj.lowRed_brighterColorIs,    colorDataObj.lowRedRGB_fontLuminance,   colorDataObj.lowRedRGB_bgLuminance    );
  colorDataObj.currentContrast_noGreen  = calcContrast( colorDataObj.noGreen_brighterColorIs,   colorDataObj.noGreenRGB_fontLuminance,  colorDataObj.noGreenRGB_bgLuminance   );
  colorDataObj.currentContrast_lowGreen = calcContrast( colorDataObj.lowGreen_brighterColorIs,  colorDataObj.lowGreenRGB_fontLuminance, colorDataObj.lowGreenRGB_bgLuminance  );
  colorDataObj.currentContrast_noBlue   = calcContrast( colorDataObj.noBlue_brighterColorIs,    colorDataObj.noBlueRGB_fontLuminance,   colorDataObj.noBlueRGB_bgLuminance    );
  colorDataObj.currentContrast_lowBlue  = calcContrast( colorDataObj.lowBlue_brighterColorIs,   colorDataObj.lowBlueRGB_fontLuminance,  colorDataObj.lowBlueRGB_bgLuminance   );
  colorDataObj.currentContrast_noColor  = calcContrast( colorDataObj.noColor_brighterColorIs,   colorDataObj.noColorRGB_fontLuminance,  colorDataObj.noColorRGB_bgLuminance   );
  colorDataObj.currentContrast_lowColor = calcContrast( colorDataObj.lowColor_brighterColorIs,  colorDataObj.lowColorRGB_fontLuminance, colorDataObj.lowColorRGB_bgLuminance  );




  return colorDataObj; 
}



function buildColorDataObject( fontInRGBA, bgInRGB, fontColorInHex, bgColorInHex, colorDataObj ) {
  
  var returnDataObject = colorDataObj;

  colorDataObj.fontColorInHex = fontColorInHex;
  colorDataObj.bgColorInHex   = bgColorInHex;
  colorDataObj.fontColors     = fontInRGBA;
  colorDataObj.bgColors       = bgInRGB;
  
  var fontColorSansAlpha = convertRGBwithAlphaChannel(fontInRGBA, bgInRGB);
  colorDataObj.fontColorSansAlpha = fontColorSansAlpha;

  var fontLuminance = calcLuminance( fontColorSansAlpha.r, fontColorSansAlpha.g, fontColorSansAlpha.b );
  colorDataObj.fontLuminance = fontLuminance;
  
  var bgLuminance = calcLuminance( bgInRGB.r, bgInRGB.g, bgInRGB.b );
  colorDataObj.bgLuminance = bgLuminance;
  
  colorDataObj.brighterColorIs          = defineBrighterLuminance(fontLuminance, bgLuminance);
  colorDataObj.noRedRGB_font            = cbTranslate(colorDataObj.fontColorSansAlpha.r,colorDataObj.fontColorSansAlpha.g,colorDataObj.fontColorSansAlpha.b, 'red', 'no');
  colorDataObj.noRedRGB_bg              = cbTranslate(colorDataObj.bgColors.r,colorDataObj.bgColors.g,colorDataObj.bgColors.b, 'red', 'no');
  colorDataObj.noRedRGB_fontLuminance   = calcLuminance(colorDataObj.noRedRGB_font.r, colorDataObj.noRedRGB_font.g, colorDataObj.noRedRGB_font.b);
  colorDataObj.noRedRGB_bgLuminance     = calcLuminance(colorDataObj.noRedRGB_bg.r, colorDataObj.noRedRGB_bg.g, colorDataObj.noRedRGB_bg.b);
  colorDataObj.noRed_brighterColorIs    = defineBrighterLuminance(colorDataObj.noRedRGB_fontLuminance, colorDataObj.noRedRGB_bgLuminance);

  colorDataObj.lowRedRGB_font           = cbTranslate(colorDataObj.fontColorSansAlpha.r,colorDataObj.fontColorSansAlpha.g,colorDataObj.fontColorSansAlpha.b, 'red', 'low');
  colorDataObj.lowRedRGB_bg             = cbTranslate(colorDataObj.bgColors.r,colorDataObj.bgColors.g,colorDataObj.bgColors.b, 'red', 'low');
  colorDataObj.lowRedRGB_fontLuminance  = calcLuminance(colorDataObj.lowRedRGB_font.r, colorDataObj.lowRedRGB_font.g, colorDataObj.lowRedRGB_font.b);
  colorDataObj.lowRedRGB_bgLuminance    = calcLuminance(colorDataObj.lowRedRGB_bg.r, colorDataObj.lowRedRGB_bg.g, colorDataObj.lowRedRGB_bg.b);
  colorDataObj.lowRed_brighterColorIs   = defineBrighterLuminance(colorDataObj.lowRedRGB_fontLuminance, colorDataObj.lowRedRGB_bgLuminance);

  colorDataObj.noGreenRGB_font          = cbTranslate(colorDataObj.fontColorSansAlpha.r,colorDataObj.fontColorSansAlpha.g,colorDataObj.fontColorSansAlpha.b, 'green', 'no');
  colorDataObj.noGreenRGB_bg            = cbTranslate(colorDataObj.bgColors.r,colorDataObj.bgColors.g,colorDataObj.bgColors.b, 'green', 'no');
  colorDataObj.noGreenRGB_fontLuminance = calcLuminance(colorDataObj.noGreenRGB_font.r, colorDataObj.noGreenRGB_font.g, colorDataObj.noGreenRGB_font.b);
  colorDataObj.noGreenRGB_bgLuminance   = calcLuminance(colorDataObj.noGreenRGB_bg.r, colorDataObj.noGreenRGB_bg.g, colorDataObj.noGreenRGB_bg.b);
  colorDataObj.noGreen_brighterColorIs  = defineBrighterLuminance(colorDataObj.noGreenRGB_fontLuminance, colorDataObj.noGreenRGB_bgLuminance);

  colorDataObj.lowGreenRGB_font         = cbTranslate(colorDataObj.fontColorSansAlpha.r,colorDataObj.fontColorSansAlpha.g,colorDataObj.fontColorSansAlpha.b, 'green', 'low');
  colorDataObj.lowGreenRGB_bg           = cbTranslate(colorDataObj.bgColors.r,colorDataObj.bgColors.g,colorDataObj.bgColors.b, 'green', 'low');
  colorDataObj.lowGreenRGB_fontLuminance= calcLuminance(colorDataObj.lowGreenRGB_font.r, colorDataObj.lowGreenRGB_font.g, colorDataObj.lowGreenRGB_font.b);
  colorDataObj.lowGreenRGB_bgLuminance  = calcLuminance(colorDataObj.lowGreenRGB_bg.r, colorDataObj.lowGreenRGB_bg.g, colorDataObj.lowGreenRGB_bg.b);
  colorDataObj.lowGreen_brighterColorIs = defineBrighterLuminance(colorDataObj.lowGreenRGB_fontLuminance, colorDataObj.lowGreenRGB_bgLuminance);

  colorDataObj.noBlueRGB_font           = cbTranslate(colorDataObj.fontColorSansAlpha.r,colorDataObj.fontColorSansAlpha.g,colorDataObj.fontColorSansAlpha.b, 'blue', 'no');
  colorDataObj.noBlueRGB_bg             = cbTranslate(colorDataObj.bgColors.r,colorDataObj.bgColors.g,colorDataObj.bgColors.b, 'blue', 'no');
  colorDataObj.noBlueRGB_fontLuminance  = calcLuminance(colorDataObj.noBlueRGB_font.r, colorDataObj.noBlueRGB_font.g, colorDataObj.noBlueRGB_font.b);
  colorDataObj.noBlueRGB_bgLuminance    = calcLuminance(colorDataObj.noBlueRGB_bg.r, colorDataObj.noBlueRGB_bg.g, colorDataObj.noBlueRGB_bg.b);
  colorDataObj.noBlue_brighterColorIs   = defineBrighterLuminance(colorDataObj.noBlueRGB_fontLuminance, colorDataObj.noBlueRGB_bgLuminance);

  colorDataObj.lowBlueRGB_font          = cbTranslate(colorDataObj.fontColorSansAlpha.r,colorDataObj.fontColorSansAlpha.g,colorDataObj.fontColorSansAlpha.b, 'blue', 'low');
  colorDataObj.lowBlueRGB_bg            = cbTranslate(colorDataObj.bgColors.r,colorDataObj.bgColors.g,colorDataObj.bgColors.b, 'blue', 'low');
  colorDataObj.lowBlueRGB_fontLuminance = calcLuminance(colorDataObj.lowBlueRGB_font.r, colorDataObj.lowBlueRGB_font.g, colorDataObj.lowBlueRGB_font.b);
  colorDataObj.lowBlueRGB_bgLuminance   = calcLuminance(colorDataObj.lowBlueRGB_bg.r, colorDataObj.lowBlueRGB_bg.g, colorDataObj.lowBlueRGB_bg.b);
  colorDataObj.lowBlue_brighterColorIs  = defineBrighterLuminance(colorDataObj.lowBlueRGB_fontLuminance, colorDataObj.lowBlueRGB_bgLuminance);

  colorDataObj.noColorRGB_font          = cbTranslate(colorDataObj.fontColorSansAlpha.r,colorDataObj.fontColorSansAlpha.g,colorDataObj.fontColorSansAlpha.b, 'gray', 'no');
  colorDataObj.noColorRGB_bg            = cbTranslate(colorDataObj.bgColors.r,colorDataObj.bgColors.g,colorDataObj.bgColors.b, 'gray', 'no');
  colorDataObj.noColorRGB_fontLuminance = calcLuminance(colorDataObj.noColorRGB_font.r, colorDataObj.noColorRGB_font.g, colorDataObj.noColorRGB_font.b);
  colorDataObj.noColorRGB_bgLuminance   = calcLuminance(colorDataObj.noColorRGB_bg.r, colorDataObj.noColorRGB_bg.g, colorDataObj.noColorRGB_bg.b);
  colorDataObj.noColor_brighterColorIs  = defineBrighterLuminance(colorDataObj.noColorRGB_fontLuminance, colorDataObj.noColorRGB_bgLuminance);

  colorDataObj.lowColorRGB_font         = cbTranslate(colorDataObj.fontColorSansAlpha.r,colorDataObj.fontColorSansAlpha.g,colorDataObj.fontColorSansAlpha.b, 'gray', 'low');
  colorDataObj.lowColorRGB_bg           = cbTranslate(colorDataObj.bgColors.r,colorDataObj.bgColors.g,colorDataObj.bgColors.b, 'gray', 'low');
  colorDataObj.lowColorRGB_fontLuminance= calcLuminance(colorDataObj.lowColorRGB_font.r, colorDataObj.lowColorRGB_font.g, colorDataObj.lowColorRGB_font.b);
  colorDataObj.lowColorRGB_bgLuminance  = calcLuminance(colorDataObj.lowColorRGB_bg.r, colorDataObj.lowColorRGB_bg.g, colorDataObj.lowColorRGB_bg.b);
  colorDataObj.lowColor_brighterColorIs = defineBrighterLuminance(colorDataObj.lowColorRGB_fontLuminance, colorDataObj.lowColorRGB_bgLuminance);
// END set values for different forms of colorblindness

  return colorDataObj;

  function defineBrighterLuminance(fontLum, bgLum) {
    if( fontLum > bgLum )   { return 'font'   };
    if( fontLum < bgLum )   { return 'bg'     };
    if( fontLum == bgLum )  { return 'equal'  };
    return null;
  }

}

function constructColorData( fontColorInRGBA, bgColorInRGB, fontLuminance_TARGET, brighterColorIs_TARGET ) {

}

function calcLuminance( redValue, greenValue, blueValue ) {
  return 0.2126*useLuminanceMultiplier(redValue) + 0.7152*useLuminanceMultiplier(greenValue) + 0.0722*useLuminanceMultiplier(blueValue);
}

function calcContrast( brighterColorIs, fontLum, bgLum ) {
// function calcContrast( colorDataObj ) {
  if(brighterColorIs == 'font') return ( (fontLum + 0.05) / (bgLum + 0.05) ); 
  else if(brighterColorIs == 'bg') return ( (bgLum + 0.05) / (fontLum + 0.05) ); 
  else if(brighterColorIs == 'equal') return 1;
}

function useLuminanceMultiplier( sourceValue ) {
  if(sourceValue / 255 <= 0.03928) return sourceValue / 255 / 12.92;
  else return Math.pow((sourceValue/255 + 0.055)/1.055, 2.4);
}

///####################### !important
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



function getContrastRangeValues( colorDataObj ) {

  if( colorDataObj.brighterColorIs == 'font' && colorDataObj.targetContrast != 0 ) {
    // get font range values first
    // var adjRed_font    = useLuminanceMultiplier(colorDataObj.fontColors.r);
    // var adjGreen_font  = useLuminanceMultiplier(colorDataObj.fontColors.g);
    // var adjBlue_font   = useLuminanceMultiplier(colorDataObj.fontColors.b);
    // fontColorSans

    var adjRed_font    = useLuminanceMultiplier(colorDataObj.fontColorSansAlpha.r);
    var adjGreen_font  = useLuminanceMultiplier(colorDataObj.fontColorSansAlpha.g);
    var adjBlue_font   = useLuminanceMultiplier(colorDataObj.fontColorSansAlpha.b);

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
    var adjRed_font    = useLuminanceMultiplier(colorDataObj.fontColorSansAlpha.r); 
    var adjGreen_font  = useLuminanceMultiplier(colorDataObj.fontColorSansAlpha.g);
    var adjBlue_font   = useLuminanceMultiplier(colorDataObj.fontColorSansAlpha.b);
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
      .css('right', '101px');
    $('#cp_background-color-settings .cp_color-settings_a11y-fail-range').eq(1)
      .attr('data-fail-value', 260 - normalizeRange(colorDataObj.bgRangeGreen))
      .css('width', (260 - normalizeRange(colorDataObj.bgRangeGreen)) + 'px')
      .css('right', '101px');
    $('#cp_background-color-settings .cp_color-settings_a11y-fail-range').eq(2)
      .attr('data-fail-value', 260 - normalizeRange(colorDataObj.bgRangeBlue))
      .css('width', (260 - normalizeRange(colorDataObj.bgRangeBlue)) + 'px')
      .css('right', '101px');
    $('.cp_color-settings_a11y-fail-range')
      .removeClass('hide')
      .attr('aria-hidden', 'false')
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
      .css('right', '101px');
    $('#cp_font-color-settings .cp_color-settings_a11y-fail-range').eq(1)
      .attr('data-fail-value', 260 - normalizeRange(colorDataObj.fontRangeGreen))
      .css('width', (260 - normalizeRange(colorDataObj.fontRangeGreen)) + 'px')
      .css('right', '101px');
    $('#cp_font-color-settings .cp_color-settings_a11y-fail-range').eq(2)
      .attr('data-fail-value', 260 - normalizeRange(colorDataObj.fontRangeBlue))
      .css('width', (260 - normalizeRange(colorDataObj.fontRangeBlue)) + 'px')
      .css('right', '101px');
    $('.cp_color-settings_a11y-fail-range')
      .removeClass('hide')
      .attr('aria-hidden', 'false')
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
        // var cbFunc = Object.byString(fBlind, currentColorblindness);
        // &&&&&&&&
        // var cbColor = cbFunc([ colorDataObj.fontColorSansAlpha.r, colorDataObj.fontColorSansAlpha.g, colorDataObj.fontColorSansAlpha.b]);
        // var cbBgColor = cbFunc([ colorDataObj.bgColors.r, colorDataObj.bgColors.g, colorDataObj.bgColors.b]);
        var cbTypeAndAmount = cbTypeFilter(currentColorblindness);
        var cbColor = cbTranslate(colorDataObj.fontColorSansAlpha.r, colorDataObj.fontColorSansAlpha.g, colorDataObj.fontColorSansAlpha.b, cbTypeAndAmount.type, cbTypeAndAmount.amount );
        var cbBgColor = cbTranslate(colorDataObj.bgColors.r, colorDataObj.bgColors.g, colorDataObj.bgColors.b, cbTypeAndAmount.type, cbTypeAndAmount.amount);
        // var cbColor = cbFunc([ $('#cp_slider_font_first-value').val(), $('#cp_slider_font_second-value').val(), $('#cp_slider_font_third-value').val() ])
        // var cbBgColor = cbFunc([ $('#cp_slider_bg_first-value').val(), $('#cp_slider_bg_second-value').val(), $('#cp_slider_bg_third-value').val() ])
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
        // var cbFunc = Object.byString(fBlind,currentColorblindness);
        //fontColorInHex  = cbFunc([redValue_font, greenValue_font,  blueValue_font]); 
        //bgColorInHex    = cbFunc([redValue_bg,   greenValue_bg,    blueValue_bg]);
        var cbTypeAndAmount = cbTypeFilter(currentColorblindness);
        fontColorInHex  = cbTranslate(redValue_font, greenValue_font,  blueValue_font, ); 
        bgColorInHex    = cbTranslate(redValue_bg,   greenValue_bg,    blueValue_bg, ); 
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

function colorBlindnessFilter( colorInRGB, colorblindType ) {
  colorblindType = colorblindType.toLowerCase();
  var colorblindName, returnObject = {};;
  switch (colorblindType) {
    case 'red'      : 
    case 'no-red'   : 
    case 'nored'    : colorblindName = "protanopia";    break;
    case 'low-red'  :
    case 'lowred'   : colorblindName = "protanomaly";   break;
    case 'green'    :
    case 'no-green' :
    case 'nogreen'  : colorblindName = "deuteranopia";  break;
    case 'low-green':
    case 'lowgreen' : colorblindName = "deuteranomaly"; break;
    case 'blue'     :
    case 'no-blue'  :
    case 'noblue'   : colorblindName = "tritanopia";    break;
    case 'low-blue' :
    case 'lowblue'  : colorblindName = "tritanomaly";   break;
    case 'gray'  :
    case 'no-color' :
    case 'nocolor'  : colorblindName = "achromatopsia"; break;
    case 'low-color':
    case 'lowcolor' : colorblindName = "achromatomaly"; break;
  }
  returnObject.colorblindType   = colorblindType;
  returnObject.colorblindName   = colorblindName;
  // var cbFunc = Object.byString(fBlind,currentColorblindness);
  // returnObject.fontColor        = cbFunc([redValue_font, greenValue_font,  blueValue_font]); 
  // returnObject.bgColor          = cbFunc([redValue_bg,   greenValue_bg,    blueValue_bg]);
  var cbTypeAndAmount     = cbTypeFilter(currentColorblindness);
  returnObject.fontColor  = cbTranslate(redValue_font, greenValue_font,  blueValue_font, cbTypeAndAmount.type, cbTypeAndAmount.amount, 'object'); 
  returnObject.bgColor    = cbTranslate(redValue_bg,   greenValue_bg,    blueValue_bg, cbTypeAndAmount.type, cbTypeAndAmount.amount, 'object');
  
  return returnObject;  
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


// closest color matching solution

function convertColorNameToReadable(stringArg) { // used for screen readers
  var returnResult = stringArg.replace(/((?!\b)[A-Z])/g, '<span class="sr-hide"> </span>$&');
  return returnResult;
}

function searchColorHexByName(colorNameArg) {
  colorNameArg = colorNameArg.toLowerCase();
  var table = ColorTable;
  for(i=0; i<table.length; i++) {
    var thisColorName = table[i].name.toLowerCase();
    if(colorNameArg == thisColorName) {
      return table[i].hex;
    }
  }
  return false; // color name not found
}

// sample: applyColorNameToRGB('#cp_background-color-settings', 'Maroon')
$('#background-color-name').bind('click', function() {
  var self = $(this),
      targetContainer = $(this).parents('.cp_color-settings_container'),
      colorNameArg = self.find('.color-name').attr('data-colorname');
  applyColorToRGB(targetContainer, colorNameArg);
});

$('#font-color-name').bind('click', function() {
  var self = $(this),
      targetContainer = $(this).parents('.cp_color-settings_container'),
      colorNameArg = self.find('.color-name').attr('data-colorname');
  applyColorToRGB(targetContainer, colorNameArg);
});



function applyColorToRGB(targetContainer, colorArg) {
  var colorNameInHex, colorNameInRGB;
  if(typeof colorArg === 'string') {
    colorNameInHex = searchColorHexByName(colorArg);
    colorNameInRGB = Hex2RGB(colorNameInHex);
  } else {
    colorNameInRGB = colorArg;
  }
  targetContainer = $(targetContainer);
  var redTextfield    = targetContainer.find('[aria-label="red value"]'),
      greenTextfield  = targetContainer.find('[aria-label="green value"]'),
      blueTextfield   = targetContainer.find('[aria-label="blue value"]'),
      alphaTextfield  = targetContainer.find('[aria-label="alpha channel"]'),
      redMarker       = targetContainer.find('.cp_color-settings_slide-marker').eq(0),
      greenMarker     = targetContainer.find('.cp_color-settings_slide-marker').eq(1),
      blueMarker      = targetContainer.find('.cp_color-settings_slide-marker').eq(2),
      alphaMarker     = targetContainer.find('.cp_color-settings_slide-marker').eq(3);


  // var alphaTextfield = targetContainer.find('[aria-label="alpha-value"]');
  // var alphaMarker = targetContainer.find('.cp_color-settings_marker-color').eq(3);
  // alphaTextfield.val(1).attr('value','1'); // resets alpha to 1
  alphaTextfield
    .val(100)
    .attr('value', 100);
  redTextfield
    .val(colorNameInRGB['r'])
    .attr('value', colorNameInRGB['r']);
  blueTextfield
    .val(colorNameInRGB['b'])
    .attr('value', colorNameInRGB['b']);
  greenTextfield
    .val(colorNameInRGB['g'])
    .attr('value', colorNameInRGB['g'])
    .trigger('change'); // activates color shift
  moveMarker( redMarker,    colorNameInRGB['r'] );
  moveMarker( greenMarker,  colorNameInRGB['g'] );
  moveMarker( blueMarker,   colorNameInRGB['b'] );
  moveMarker( alphaMarker, 100, 255 );
}

var ColorTable = [
  { name: 'Black',              hex: '000000' }, 
  { name: 'Navy',               hex: '000080' }, 
  { name: 'DarkBlue',           hex: '00008B' }, 
  { name: 'MediumBlue',         hex: '0000CD' }, 
  { name: 'Blue',               hex: '0000FF' }, 
  { name: 'DarkGreen',          hex: '006400' }, 
  { name: 'Green',              hex: '008000' }, 
  { name: 'Teal',               hex: '008080' }, 
  { name: 'DarkCyan',           hex: '008B8B' }, 
  { name: 'DeepSkyBlue',        hex: '00BFFF' }, 
  { name: 'DarkTurquoise',      hex: '00CED1' }, 
  { name: 'MediumSpringGreen',  hex: '00FA9A' }, 
  { name: 'Lime',               hex: '00FF00' }, 
  { name: 'SpringGreen',        hex: '00FF7F' }, 
  { name: 'Aqua',               hex: '00FFFF' }, 
  { name: 'Cyan',               hex: '00FFFF' }, 
  { name: 'MidnightBlue',       hex: '191970' }, 
  { name: 'DodgerBlue',         hex: '1E90FF' }, 
  { name: 'LightSeaGreen',      hex: '20B2AA' }, 
  { name: 'ForestGreen',        hex: '228B22' }, 
  { name: 'SeaGreen',           hex: '2E8B57' }, 
  { name: 'DarkSlateGray',      hex: '2F4F4F' }, 
  { name: 'DarkSlateGrey',      hex: '2F4F4F' }, 
  { name: 'LimeGreen',          hex: '32CD32' }, 
  { name: 'MediumSeaGreen',     hex: '3CB371' }, 
  { name: 'Turquoise',          hex: '40E0D0' }, 
  { name: 'RoyalBlue',          hex: '4169E1' }, 
  { name: 'SteelBlue',          hex: '4682B4' }, 
  { name: 'DarkSlateBlue',      hex: '483D8B' }, 
  { name: 'MediumTurquoise',    hex: '48D1CC' }, 
  { name: 'Indigo',             hex: '4B0082' }, 
  { name: 'DarkOliveGreen',     hex: '556B2F' }, 
  { name: 'CadetBlue',          hex: '5F9EA0' }, 
  { name: 'CornflowerBlue',     hex: '6495ED' }, 
  { name: 'RebeccaPurple',      hex: '663399' }, 
  { name: 'MediumAquaMarine',   hex: '66CDAA' }, 
  { name: 'DimGray',            hex: '696969' }, 
  { name: 'DimGrey',            hex: '696969' }, 
  { name: 'SlateBlue',          hex: '6A5ACD' }, 
  { name: 'OliveDrab',          hex: '6B8E23' }, 
  { name: 'SlateGray',          hex: '708090' }, 
  { name: 'SlateGrey',          hex: '708090' }, 
  { name: 'LightSlateGray',     hex: '778899' }, 
  { name: 'LightSlateGrey',     hex: '778899' }, 
  { name: 'MediumSlateBlue',    hex: '7B68EE' }, 
  { name: 'LawnGreen',          hex: '7CFC00' }, 
  { name: 'Chartreuse',         hex: '7FFF00' }, 
  { name: 'Aquamarine',         hex: '7FFFD4' }, 
  { name: 'Maroon',             hex: '800000' }, 
  { name: 'Purple',             hex: '800080' }, 
  { name: 'Olive',              hex: '808000' }, 
  { name: 'Gray',               hex: '808080' }, 
  { name: 'Grey',               hex: '808080' }, 
  { name: 'SkyBlue',            hex: '87CEEB' }, 
  { name: 'LightSkyBlue',       hex: '87CEFA' }, 
  { name: 'BlueViolet',         hex: '8A2BE2' }, 
  { name: 'DarkRed',            hex: '8B0000' }, 
  { name: 'DarkMagenta',        hex: '8B008B' }, 
  { name: 'SaddleBrown',        hex: '8B4513' }, 
  { name: 'DarkSeaGreen',       hex: '8FBC8F' }, 
  { name: 'LightGreen',         hex: '90EE90' }, 
  { name: 'MediumPurple',       hex: '9370DB' }, 
  { name: 'DarkViolet',         hex: '9400D3' }, 
  { name: 'PaleGreen',          hex: '98FB98' }, 
  { name: 'DarkOrchid',         hex: '9932CC' }, 
  { name: 'YellowGreen',        hex: '9ACD32' }, 
  { name: 'Sienna',             hex: 'A0522D' }, 
  { name: 'Brown',              hex: 'A52A2A' }, 
  { name: 'DarkGray',           hex: 'A9A9A9' }, 
  { name: 'DarkGrey',           hex: 'A9A9A9' }, 
  { name: 'LightBlue',          hex: 'ADD8E6' }, 
  { name: 'GreenYellow',        hex: 'ADFF2F' }, 
  { name: 'PaleTurquoise',      hex: 'AFEEEE' }, 
  { name: 'LightSteelBlue',     hex: 'B0C4DE' }, 
  { name: 'PowderBlue',         hex: 'B0E0E6' }, 
  { name: 'FireBrick',          hex: 'B22222' }, 
  { name: 'DarkGoldenRod',      hex: 'B8860B' }, 
  { name: 'MediumOrchid',       hex: 'BA55D3' }, 
  { name: 'RosyBrown',          hex: 'BC8F8F' }, 
  { name: 'DarkKhaki',          hex: 'BDB76B' }, 
  { name: 'Silver',             hex: 'C0C0C0' }, 
  { name: 'MediumVioletRed',    hex: 'C71585' }, 
  { name: 'IndianRed',          hex: 'CD5C5C' }, 
  { name: 'Peru',               hex: 'CD853F' }, 
  { name: 'Chocolate',          hex: 'D2691E' }, 
  { name: 'Tan',                hex: 'D2B48C' }, 
  { name: 'LightGray',          hex: 'D3D3D3' }, 
  { name: 'LightGrey',          hex: 'D3D3D3' }, 
  { name: 'Thistle',            hex: 'D8BFD8' }, 
  { name: 'Orchid',             hex: 'DA70D6' }, 
  { name: 'GoldenRod',          hex: 'DAA520' }, 
  { name: 'PaleVioletRed',      hex: 'DB7093' }, 
  { name: 'Crimson',            hex: 'DC143C' }, 
  { name: 'Gainsboro',          hex: 'DCDCDC' }, 
  { name: 'Plum',               hex: 'DDA0DD' }, 
  { name: 'BurlyWood',          hex: 'DEB887' }, 
  { name: 'LightCyan',          hex: 'E0FFFF' }, 
  { name: 'Lavender',           hex: 'E6E6FA' }, 
  { name: 'DarkSalmon',         hex: 'E9967A' }, 
  { name: 'Violet',             hex: 'EE82EE' }, 
  { name: 'PaleGoldenRod',      hex: 'EEE8AA' }, 
  { name: 'LightCoral',         hex: 'F08080' }, 
  { name: 'Khaki',              hex: 'F0E68C' }, 
  { name: 'AliceBlue',          hex: 'F0F8FF' }, 
  { name: 'HoneyDew',           hex: 'F0FFF0' }, 
  { name: 'Azure',              hex: 'F0FFFF' }, 
  { name: 'SandyBrown',         hex: 'F4A460' }, 
  { name: 'Wheat',              hex: 'F5DEB3' }, 
  { name: 'Beige',              hex: 'F5F5DC' }, 
  { name: 'WhiteSmoke',         hex: 'F5F5F5' }, 
  { name: 'MintCream',          hex: 'F5FFFA' }, 
  { name: 'GhostWhite',         hex: 'F8F8FF' }, 
  { name: 'Salmon',             hex: 'FA8072' }, 
  { name: 'AntiqueWhite',       hex: 'FAEBD7' }, 
  { name: 'Linen',              hex: 'FAF0E6' }, 
  { name: 'LightGoldenRodYellow',hex: 'FAFAD2' }, 
  { name: 'OldLace',            hex: 'FDF5E6' }, 
  { name: 'Red',                hex: 'FF0000' }, 
  { name: 'Fuchsia',            hex: 'FF00FF' }, 
  { name: 'Magenta',            hex: 'FF00FF' }, 
  { name: 'DeepPink',           hex: 'FF1493' }, 
  { name: 'OrangeRed',          hex: 'FF4500' }, 
  { name: 'Tomato',             hex: 'FF6347' }, 
  { name: 'HotPink',            hex: 'FF69B4' }, 
  { name: 'Coral',              hex: 'FF7F50' }, 
  { name: 'DarkOrange',         hex: 'FF8C00' }, 
  { name: 'LightSalmon',        hex: 'FFA07A' }, 
  { name: 'Orange',             hex: 'FFA500' }, 
  { name: 'LightPink',          hex: 'FFB6C1' }, 
  { name: 'Pink',               hex: 'FFC0CB' }, 
  { name: 'Gold',               hex: 'FFD700' }, 
  { name: 'PeachPuff',          hex: 'FFDAB9' }, 
  { name: 'NavajoWhite',        hex: 'FFDEAD' }, 
  { name: 'Moccasin',           hex: 'FFE4B5' }, 
  { name: 'Bisque',             hex: 'FFE4C4' }, 
  { name: 'MistyRose',          hex: 'FFE4E1' }, 
  { name: 'BlanchedAlmond',     hex: 'FFEBCD' }, 
  { name: 'PapayaWhip',         hex: 'FFEFD5' }, 
  { name: 'LavenderBlush',      hex: 'FFF0F5' }, 
  { name: 'SeaShell',           hex: 'FFF5EE' }, 
  { name: 'Cornsilk',           hex: 'FFF8DC' }, 
  { name: 'LemonChiffon',       hex: 'FFFACD' }, 
  { name: 'FloralWhite',        hex: 'FFFAF0' }, 
  { name: 'Snow',               hex: 'FFFAFA' }, 
  { name: 'Yellow',             hex: 'FFFF00' }, 
  { name: 'LightYellow',        hex: 'FFFFE0' }, 
  { name: 'Ivory',              hex: 'FFFFF0' }, 
  { name: 'White',              hex: 'FFFFFF' }
];



function findClosestColorHex(hex) {
  var rgb = Hex2RGB(hex);
  var delta = 3 * 256*256;
  var temp = {r:0, g:0, b:0};
  var nameFound = 'black';
  var table = ColorTable;
  
  for(i=0; i<table.length; i++)
  {
    temp = Hex2RGB(table[i].hex);
    if(Math.pow(temp.r-rgb.r,2) + Math.pow(temp.g-rgb.g,2) + Math.pow(temp.b-rgb.b,2) < delta)
    {
      delta = Math.pow(temp.r-rgb.r,2) + Math.pow(temp.g-rgb.g,2) + Math.pow(temp.b-rgb.b,2);
      nameFound = table[i].name;
    }
  }
  return nameFound;
}

function findClosestColorRGB(colorSet) {
  var rgb = colorSet;
  var delta = 3 * 256*256;
  var temp = {r:0, g:0, b:0};
  var nameFound = 'XXXXX';
  var table = ColorTable;
  
  for(i=0; i<table.length; i++)
  {
    temp = Hex2RGB(table[i].hex);
    if(Math.pow(temp.r-rgb.r,2) + Math.pow(temp.g-rgb.g,2) + Math.pow(temp.b-rgb.b,2) < delta)
    {
      delta = Math.pow(temp.r-rgb.r,2) + Math.pow(temp.g-rgb.g,2) + Math.pow(temp.b-rgb.b,2);
      nameFound = table[i].name;
    }
  }
  return nameFound;
}

//alert(findClosestColor('#884455', ColorTable));



// Example code
// findClosestColorRGB(redVal, blueVal, greenVal, ColorTable);
// credits

// CSS Color Name Matcher - https://stackoverflow.com/users/8005142/todor-simeonov


// Alpha Channel Font rgba > rgb calculator

// convertRGBwithAlphaChannel({ r: 255, g: 0, b: 0, a: 1 }, { r: 255, g: 255, b: 255 })
function convertRGBwithAlphaChannel(fontColorRGBA, bgColorRGB) {
  var alpha     = fontColorRGBA.a * 0.01,
      fontRed   = fontColorRGBA.r,
      fontGreen = fontColorRGBA.g,
      fontBlue  = fontColorRGBA.b,
      bgRed     = bgColorRGB.r,
      bgGreen   = bgColorRGB.g,
      bgBlue    = bgColorRGB.b;

  var calculatedRed, calculatedGreen, calculatedBlue;
  var invertedAlpha = 1 - alpha;
  var calculatedRed   = Math.round((alpha * (fontRed   / 255) + (invertedAlpha * (bgRed   / 255))) * 255);
  var calculatedGreen = Math.round((alpha * (fontGreen / 255) + (invertedAlpha * (bgGreen / 255))) * 255);
  var calculatedBlue  = Math.round((alpha * (fontBlue  / 255) + (invertedAlpha * (bgBlue  / 255))) * 255);
  colorDataObj.fontColorSansAlpha = { r: calculatedRed, g: calculatedGreen, b: calculatedBlue };
  return colorDataObj.fontColorSansAlpha;
}

// updateCheckerboardPattern('#alpha-checkerboard-pattern', '#alpha-subcheckerboard-pattern', { r: colorDataObj.fontColors.r, g: colorDataObj.fontColors.g, b: colorDataObj.fontColors.b, colorDataObj.fontColors.a }, { r: colorDataObj.bgColors.r, g: colorDataObj.bgColors.g, b: colorDataObj.bgColors.b })
function updateCheckerboardPattern(targetSlideCheckerboard, targetSlideBackground, bgColors, fontColors) {
  targetSlideCheckerboard = $(targetSlideCheckerboard);
  targetSlideBackground   = $(targetSlideBackground);
  var fontRed     = fontColors.r,
      fontGreen   = fontColors.g,
      fontBlue    = fontColors.b,
      bgRed       = bgColors.r,
      bgGreen     = bgColors.g,
      bgBlue      = bgColors.b;
  var backgroundImageVal = 'linear-gradient(45deg, rgb('+bgRed+','+bgGreen+','+bgBlue+') 25%, transparent 25%, transparent 75%, rgb('+bgRed+','+bgGreen+','+bgBlue+') 75%, rgb('+bgRed+','+bgGreen+','+bgBlue+')), linear-gradient(45deg, rgb('+bgRed+','+bgGreen+','+bgBlue+') 25%, transparent 25%, transparent 75%, rgb('+bgRed+','+bgGreen+','+bgBlue+') 75%, rgb('+bgRed+','+bgGreen+','+bgBlue+'))';
  targetSlideCheckerboard
    .css('background-image', backgroundImageVal);
  targetSlideBackground
    .css('background',    '-moz-linear-gradient(left,     rgb('+fontRed+','+fontGreen+','+fontBlue+') 0%, rgb('+bgRed+','+bgGreen+','+bgBlue+') 95%)')
    .css('background', '-webkit-linear-gradient(left,     rgb('+fontRed+','+fontGreen+','+fontBlue+') 0%, rgb('+bgRed+','+bgGreen+','+bgBlue+') 95%)')
    .css('background',         'linear-gradient(to right, rgb('+fontRed+','+fontGreen+','+fontBlue+') 0%, rgb('+bgRed+','+bgGreen+','+bgBlue+') 95%)');
}




// START Tools

var Hex2RGB = function(hex) {
  if (hex.lastIndexOf('#') > -1) { hex = hex.replace(/#/, '0x'); } 
  else { hex = '0x' + hex; }
  var r = hex >> 16;
  var g = (hex & 0x00FF00) >> 8;
  var b = hex & 0x0000FF;
  return {r:r, g:g, b:b};
};

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


// END Tools
