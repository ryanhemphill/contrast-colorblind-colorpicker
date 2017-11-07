// analytics.js
$(document).ready(function() {
  updateAnalyticsTableValues();
});

var focusableDataCells = $('.data-cell[tabindex], .data-cell[tabindex] > *');
focusableDataCells
  .bind('mouseenter mouseover',function() {
    var self = $(this);
    if(!self.hasClass('data-cell')) {
      self = self.parents('.data-cell');
    }
    self.addClass('active');
  })
  .bind('mouseout mouseleave', function() {
    var self = $(this);
    if(self.hasClass('data-cell')) {
      // self = self.parents('.data-cell');
      // do nothing
      self.removeClass('active');
    } else {
      
    } 
    
  });


function updateAnalyticsTableValues() {
  var contrastDefault   = Number(colorDataObj.currentContrast);
  var contrastNoRed     = Number(colorDataObj.currentContrast_noRed);
  var contrastLowRed    = Number(colorDataObj.currentContrast_lowRed);
  var contrastNoGreen   = Number(colorDataObj.currentContrast_noGreen);
  var contrastLowGreen  = Number(colorDataObj.currentContrast_lowGreen);
  var contrastNoBlue    = Number(colorDataObj.currentContrast_noBlue);
  var contrastLowBlue   = Number(colorDataObj.currentContrast_lowBlue);
  var contrastNoColor   = Number(colorDataObj.currentContrast_noColor);
  var contrastLowColor  = Number(colorDataObj.currentContrast_lowColor);

  var normal_col    = $('#normal-vision-column'),
      noRed_col     = $('#no-red-column'),
      lowRed_col    = $('#low-red-column'),
      noGreen_col   = $('#no-green-column'),
      lowGreen_col  = $('#low-green-column'),
      noBlue_col    = $('#no-blue-column'),
      lowBlue_col   = $('#low-blue-column'),
      noColor_col   = $('#no-color-column'),
      lowColor_col  = $('#low-color-column');
  
  normal_col.find('.data-tag').attr('data-contrast-value', contrastDefault); 
  var normalColor_fontColorString = 'rgb('+colorDataObj.fontColorSansAlpha.r+','+colorDataObj.fontColorSansAlpha.g+','+colorDataObj.fontColorSansAlpha.b+')';
  var normalColor_fontColorStringSansAlpha = 'rgba('+colorDataObj.fontColors.r+','+colorDataObj.fontColors.g+','+colorDataObj.fontColors.b+','+colorDataObj.fontColors.a+')';
  normal_col.find('.font-swatch')
    .css('background-color', normalColor_fontColorString)
    .find('input').val(normalColor_fontColorStringSansAlpha);
  var normalColor_bgColorString = 'rgb('+colorDataObj.bgColors.r+','+colorDataObj.bgColors.g+','+colorDataObj.bgColors.b+')';
  normal_col.find('.bg-swatch')
    .css('background-color', normalColor_bgColorString)
    .find('input').val(normalColor_bgColorString);
 

  noRed_col.find('.data-tag').attr('data-contrast-value',     contrastNoRed);
  var noRed_fontColorString = 'rgb('+colorDataObj.noRedRGB_font.r+','+colorDataObj.noRedRGB_font.g+','+colorDataObj.noRedRGB_font.b+')';
  noRed_col.find('.font-swatch')
    .css('background-color', noRed_fontColorString)
    .find('input').val(noRed_fontColorString);
  var noRed_bgColorString = 'rgb('+colorDataObj.noRedRGB_bg.r+','+colorDataObj.noRedRGB_bg.g+','+colorDataObj.noRedRGB_bg.b+')';
  noRed_col.find('.bg-swatch')
    .css('background-color', noRed_bgColorString)
    .find('input').val(noRed_bgColorString);
 

  lowRed_col.find('.data-tag').attr('data-contrast-value',    contrastLowRed);
  var lowRed_fontColorString = 'rgb('+colorDataObj.lowRedRGB_font.r+','+colorDataObj.lowRedRGB_font.g+','+colorDataObj.lowRedRGB_font.b+')';
  lowRed_col.find('.font-swatch')
    .css('background-color', lowRed_fontColorString)
    .find('input').val(lowRed_fontColorString);
  var lowRed_bgColorString = 'rgb('+colorDataObj.lowRedRGB_bg.r+','+colorDataObj.lowRedRGB_bg.g+','+colorDataObj.lowRedRGB_bg.b+')';
  lowRed_col.find('.bg-swatch')
    .css('background-color', lowRed_bgColorString)
    .find('input').val(lowRed_bgColorString);

  noGreen_col.find('.data-tag').attr('data-contrast-value',   contrastNoGreen);
  var noGreen_fontColorString = 'rgb('+colorDataObj.noGreenRGB_font.r+','+colorDataObj.noGreenRGB_font.g+','+colorDataObj.noGreenRGB_font.b+')';
  noGreen_col.find('.font-swatch')
    .css('background-color', noGreen_fontColorString)
    .find('input').val(noGreen_fontColorString);
  var noGreen_bgColorString = 'rgb('+colorDataObj.noGreenRGB_bg.r+','+colorDataObj.noGreenRGB_bg.g+','+colorDataObj.noGreenRGB_bg.b+')';
  noGreen_col.find('.bg-swatch')
    .css('background-color', noGreen_bgColorString)
    .find('input').val(noGreen_bgColorString);

  lowGreen_col.find('.data-tag').attr('data-contrast-value',  contrastLowGreen);
  var lowGreen_fontColorString = 'rgb('+colorDataObj.lowGreenRGB_font.r+','+colorDataObj.lowGreenRGB_font.g+','+colorDataObj.lowGreenRGB_font.b+')';
  lowGreen_col.find('.font-swatch')
    .css('background-color', lowGreen_fontColorString)
    .find('input').val(lowGreen_fontColorString);
  var noGreen_bgColorString = 'rgb('+colorDataObj.lowGreenRGB_bg.r+','+colorDataObj.lowGreenRGB_bg.g+','+colorDataObj.lowGreenRGB_bg.b+')';
  lowGreen_col.find('.bg-swatch')
    .css('background-color', noGreen_bgColorString)
    .find('input').val(noGreen_bgColorString);

  noBlue_col.find('.data-tag').attr('data-contrast-value',    contrastNoBlue);
  var noBlue_fontColorString = 'rgb('+colorDataObj.noBlueRGB_font.r+','+colorDataObj.noBlueRGB_font.g+','+colorDataObj.noBlueRGB_font.b+')';
  noBlue_col.find('.font-swatch')
    .css('background-color', noBlue_fontColorString)
    .find('input').val(noBlue_fontColorString);
  var noBlue_bgColorString = 'rgb('+colorDataObj.noBlueRGB_bg.r+','+colorDataObj.noBlueRGB_bg.g+','+colorDataObj.noBlueRGB_bg.b+')';
  noBlue_col.find('.bg-swatch')
    .css('background-color', noBlue_bgColorString)
    .find('input').val(noBlue_bgColorString);

  lowBlue_col.find('.data-tag').attr('data-contrast-value',   contrastLowBlue); 
  var lowBlue_fontColorString = 'rgb('+colorDataObj.lowBlueRGB_font.r+','+colorDataObj.lowBlueRGB_font.g+','+colorDataObj.lowBlueRGB_font.b+')';
  lowBlue_col.find('.font-swatch')
    .css('background-color', lowBlue_fontColorString)
    .find('input').val(lowBlue_fontColorString);
  var lowBlue_bgColorString = 'rgb('+colorDataObj.lowBlueRGB_bg.r+','+colorDataObj.lowBlueRGB_bg.g+','+colorDataObj.lowBlueRGB_bg.b+')';
  lowBlue_col.find('.bg-swatch')
    .css('background-color', lowBlue_bgColorString)
    .find('input').val(lowBlue_bgColorString);

  noColor_col.find('.data-tag').attr('data-contrast-value', contrastNoColor);
  var noColor_fontColorString = 'rgb('+colorDataObj.noColorRGB_font.r+','+colorDataObj.noColorRGB_font.g+','+colorDataObj.noColorRGB_font.b+')';
  noColor_col.find('.font-swatch')
    .css('background-color', noColor_fontColorString)
    .find('input').val(noColor_fontColorString);
  var noColor_bgColorString = 'rgb('+colorDataObj.noColorRGB_bg.r+','+colorDataObj.noColorRGB_bg.g+','+colorDataObj.noColorRGB_bg.b+')';
  noColor_col.find('.bg-swatch')
    .css('background-color', noColor_bgColorString)
    .find('input').val(noColor_bgColorString);

  lowColor_col.find('.data-tag').attr('data-contrast-value',  contrastLowColor);
  var lowColor_fontColorString = 'rgb('+colorDataObj.lowColorRGB_font.r+','+colorDataObj.lowColorRGB_font.g+','+colorDataObj.lowColorRGB_font.b+')';
  lowColor_col.find('.font-swatch')
    .css('background-color', lowColor_fontColorString)
    .find('input').val(lowColor_fontColorString);
  var lowColor_bgColorString = 'rgb('+colorDataObj.lowColorRGB_bg.r+','+colorDataObj.lowColorRGB_bg.g+','+colorDataObj.lowColorRGB_bg.b+')';
  lowColor_col.find('.bg-swatch')
    .css('background-color', lowColor_bgColorString)
    .find('input').val(lowColor_bgColorString);
}


function updateAnalyticsTableState() {
  var dataTags = $('.data-tag');
  dataTags.each(function() {
    var thisTag = $(this);
    var thisContrastValue = Number(thisTag.attr('data-contrast-value')).toFixed(2);  
    // console.log('precondition value = ' + thisContrastValue);
    if(thisContrastValue.length != 0 && !isNaN(thisContrastValue)) { 
      if(thisContrastValue >= 7) {
         thisTag.attr('data-wcag-value', 'aaa-small');
      } else if(thisContrastValue >= 4.5) {
        thisTag.attr('data-wcag-value', 'aa-small-aaa-large');
      } else if(thisContrastValue >= 3) {
        thisTag.attr('data-wcag-value', 'aa-large');
      } else {
        thisTag.attr('data-wcag-value', 'fail');
      }
      var cssPushValue = 200 -  thisContrastValue*10; 
      // console.log('thisContrastValue = ' + thisContrastValue);
      thisTag
         .css('margin-top', cssPushValue + 'px'); 
    }
  });
}

var swatch = $('.bg-swatch');

swatch
  .bind('mouseenter mouseover', function() {
    var self = $(this);
    self.addClass('active');
  })
  .bind('mouseout mouseleave', function() {
    var self = $(this);
    self.removeClass('active');
  });



$(document).ready(function() {
  
  
  
  var swatch = $('.font-swatch,.bg-swatch');

  swatch
    .bind('mouseenter mouseover', function() {
      var self = $(this);
      self.addClass('active');
    })
    .bind('mouseout mouseleave', function() {
      var self = $(this);
      self.removeClass('active');
    })
    .bind('click', function(e) {
      var thisId = $(this).attr('data-id');
      e.preventDefault();
      document.execCommand('copy', false, document.getElementById(thisId).select());
      $('#announce').text('');
      setTimeout(function() {
        $('#announce').text('copied to clipboard');
      }, 100);
    });
  
  
});


$('.wcag-key-container [role="button"], .wcag-key-container [role="button"] *')
  .bind('mouseover mouseenter click', function(event) {
    var self = $(this);
    var allCases = $('[data-wcag-value]');
    var filterQuery = self.attr('data-filter-set');
    var filterCases = allCases.filter(filterQuery);
    allCases.not(filterCases).removeClass('active');
    if(event.type == 'mouseenter' || event.type == 'mouseover') {
      filterCases.addClass('active');
    } else if(event.type == 'click') {
      filterCases.toggleClass('active');
      // announce on sr
    }
  })
  .bind('mouseout mouseleave', function() {
    var allCases = $('[data-wcag-value]');
    allCases.removeClass('active');
  })
  .bind('keyup', function(event) {
    if(event.keyCode == 13) { 
      var self = $(this);
      self.triggerHandler('click'); }
  });