// analytics.js
$(document).ready(function() {

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

var dataTags;
$(document).ready(function() {
  
  dataTags = $('.data-tag');

  dataTags.each(function() {
    var thisTag = $(this);
    var thisContrastValue = Number.parseInt(thisTag.attr('data-contrast-value'));  
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