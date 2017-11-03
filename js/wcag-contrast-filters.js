// wcag-contrast-filter.js
// REQUIREMENTS : 
//  this plugin requires set-color.js
// FEATURES : 
//  This plugin provides the following...
//    (A) WCAG contrast calculations
//    (B) Colorblindness calculations (8 forms)
//    (C) Contrast channel-specific failure-range filtering
//    (D) Normal/Colorblindness channel-specific contrast value range calculaion

// [ TASKS ]
//
// 1. [x] getContrast()
// 2. [x] buildFailRanges()
// 3. [x] getColorblindFilterFor()
// 4. [x] getContrastRangeFor() 
// 5. [ ] 


// START WCAG contrast calculator functions

function getContrast(fgColorData, bgColorData, returnOption) { // must be 
  if(!returnOption) { returnOption = false; }
  // discover colorType of color data
  var fgColorType = defineColorType(fgColorData);
  var bgColorType = defineColorType(bgColorData);
  var contrastObj = {};
  if(fgColorType.indexOf('css-') > -1 || bgColorType.indexOf('css-') > -1) {
    console.log('ERROR > calcContrast() -- colorData is in css format, invalid format')
  }
  var fgLumObj = getLuminance(fgColorData, fgColorType, returnOption);
  var bgLumObj = getLuminance(bgColorData, bgColorType, returnOption);
  var fgLum, bgLum;
  
  if(returnOption == true) {
    fgLum = fgLumObj.lum;
    bgLum = bgLumObj.lum;
  } else {
    fgLum = fgLumObj;
    bgLum = bgLumObj;
  }
  // define contrast value & which one is the greater value
  if(fgLum > bgLum) {
    contrastObj.contrast    = (fgLum + 0.05) / (bgLum + 0.05);
    contrastObj.greaterLum  = 'foreground';
  } 
  else if(fgLum < bgLum) {
    contrastObj.contrast    = (bgLum + 0.05) / (fgLum + 0.05);
    contrastObj.greaterLum  = 'background';
  } 
  else { // there is no contrast...
    contrastObj.contrast    = 1;
    contrastObj.greaterLum  = 'equal';
  }

  if(returnOption === true) {
    contrastObj.fgLumObj = fgLumObj;
    contrastObj.bgLumObj = bgLumObj;
  }
  return contrastObj;
}

function buildFailRanges(fgColorData, bgColorData, colorType, contrastTestValue, channelCase) {
  if(!channelCase) { channelCase = 'all'; } // returns all fail-range cases...
  var failRangeObj = {}; // default values
  if(!colorType) { colorType == 'rgb'} // hsl failure-range not available at this time
  channelCase = channelCase.toLowerCase();
  
  if(colorType == 'rgb') {
    failMax = 0, failMax = 255; // default values
    switch(channelCase) {
      case 'red'    :
      case 'r'      : channelCase = 'red';    break;
      case 'green'  :
      case 'g'      : channelCase = 'green';  break;
      case 'blue'   :
      case 'b'      : channelCase = 'blue';   break;
      case ''       :
      case 'all'    :                         break;
      default       :
        console.log('ERROR > calcFailureRange() -- channelCase ('+ channelCase +') is invalid value');
        return false;
    }
  }
  else if(colorType == 'hsl') {
    console.log('ERROR > calcFailureRange() does not currently support hsl values');
    return false;
    // uncomment code below when ready
    // switch(channelCase) {
    //   case 'hue'        : failMin = 0; failMax = 360;                      break;
    //   case 'sat'        :
    //   case 'saturation' : failMin = 0; failMax = 100; channelCase = 'sat'; break;
    //   case 'lum'        :
    //   case 'luminosity' : failMin = 0; failMax = 100; channelCase = 'lum'; break;
    //   default           :
    //     console.log('ERROR > calcFailureRange() -- channelCase ('+ channelCase +') is invalid value');
    //     return false;
    // }
  }

  if(colorType == 'rgb') {
    // contrastTestValue
    var contrastObj = getContrast(fgColorData, bgColorData, true),
        greaterLum  = contrastObj.greaterLum,
        fgLum       = contrastObj.fgLumObj.lum,
        bgLum       = contrastObj.bgLumObj.lum, 
        rLumX_fg    = contrastObj.fgLumObj.rLumX, // multipliers - important for range calc
        gLumX_fg    = contrastObj.fgLumObj.gLumX,
        bLumX_fg    = contrastObj.fgLumObj.bLumX,
        rLumX_bg    = contrastObj.bgLumObj.rLumX,
        gLumX_bg    = contrastObj.bgLumObj.gLumX,
        bLumX_bg    = contrastObj.bgLumObj.bLumX;

    var failRangeObj = getFailRangeFor(contrastTestValue, 'all', contrastObj, channelCase);
    
  }
  

  return { failRange: failRangeObj, contrastTestValue: contrastTestValue }
}

function getFailRangeFor(contrastTestValue, colorCase, contrastObj, channelCase) {
  if(!channelCase)  { channelCase = 'all'; }
  var failRangeObj = {};
  var fgLum    = contrastObj.fgLumObj.lum,
      bgLum    = contrastObj.bgLumObj.lum, 
      rLumX_fg = contrastObj.fgLumObj.rLumX, // multipliers - important for range calc
      gLumX_fg = contrastObj.fgLumObj.gLumX,
      bLumX_fg = contrastObj.fgLumObj.bLumX,
      rLumX_bg = contrastObj.bgLumObj.rLumX,
      gLumX_bg = contrastObj.bgLumObj.gLumX,
      bLumX_bg = contrastObj.bgLumObj.bLumX,
      failFgLum,
      failBgLum,
      rLumX_fg_failVal,gLumX_fg_failVal,bLumX_fg_failVal,
      rLumX_bg_failVal,gLumX_bg_failVal,bLumX_bg_failVal,
      red_fg_failMark,green_fg_failMark,blue_fg_failMark,
      red_bg_failMark,green_bg_failMark,blue_bg_failMark;
  
  if(contrastObj.greaterLum == 'foreground') {
    failFgLum = failRangeObj.failFgLum = (contrastTestValue*(bgLum+0.05))-0.05;
    failBgLum = failRangeObj.failBgLum = ((fgLum+0.05)/contrastTestValue)-0.05;
  }
  else if(contrastObj.greaterLum == 'background') {
    failFgLum = failRangeObj.failFgLum = ((bgLum+0.05)/contrastTestValue)-0.05;
    failBgLum = failRangeObj.failBgLum = (contrastTestValue*(fgLum+0.05))-0.05;

  }
  // if(failFgLum < 0) { failFgLum = failRangeObj.failFgLum = 0; }
  // if(failBgLum < 0) { failBgLum = failRangeObj.failBgLum = 0; }

  if(channelCase == 'red' || channelCase == 'r' || channelCase == 'all') {
    rLumX_fg_failVal   = failRangeObj.rLumX_fg_failVal      = (failFgLum-(0.7152*gLumX_fg)-(0.0722*bLumX_fg))/0.2126;
    rLumX_bg_failVal   = failRangeObj.rLumX_bg_failVal      = (failBgLum-(0.7152*gLumX_bg)-(0.0722*bLumX_bg))/0.2126;
    red_fg_failMark    = failRangeObj.red_fg_failMark       = removeLumMultiplier(rLumX_fg_failVal);
    red_bg_failMark    = failRangeObj.red_bg_failMark       = removeLumMultiplier(rLumX_bg_failVal);
  } 
  if(channelCase == 'green' || channelCase == 'g' || channelCase == 'all') {
    gLumX_fg_failVal   = failRangeObj.gLumX_fg_failMark     = (failFgLum-(0.2126*rLumX_fg)-(0.0722*bLumX_fg))/0.7152;
    gLumX_bg_failVal   = failRangeObj.gLumX_bg_failMark     = (failBgLum-(0.2126*rLumX_bg)-(0.0722*bLumX_bg))/0.7152;
    green_fg_failMark  = failRangeObj.green_fg_failMark     = removeLumMultiplier(gLumX_fg_failVal);
    green_bg_failMark  = failRangeObj.green_bg_failMark     = removeLumMultiplier(gLumX_bg_failVal);
  }
  if(channelCase == 'blue' || channelCase == 'b' || channelCase == 'all') {
    bLumX_fg_failVal   = failRangeObj.bLumX_fg_failVal      = (failFgLum-(0.2126*rLumX_fg)-(0.7152*gLumX_fg))/0.0722;
    bLumX_bg_failVal   = failRangeObj.bLumX_bg_failVal      = (failBgLum-(0.2126*rLumX_bg)-(0.7152*gLumX_bg))/0.0722;
    blue_fg_failMark   = failRangeObj.blue_fg_failMark      = removeLumMultiplier(bLumX_fg_failVal);
    blue_bg_failMark   = failRangeObj.blue_bg_failMark      = removeLumMultiplier(bLumX_bg_failVal);
  }

  return failRangeObj;
}

function getContrastRangeFor(fgColorData, bgColorData, channelCase, cbTypeArg) {
  if(!channelCase)                                          { channelCase = 'all';    }
  if(!cbTypeArg || cbTypeArg == 'none' || cbTypeArg == '')  { cbTypeArg   = 'normal'  }
  var cbTypeObj, fgColorData_adjusted = {}, bgColorData_adjusted = {};
  if(cbTypeArg !== 'normal') {
    cbTypeObj            = cbTypeFilter(nameString);
    fgColorData_adjusted = cbTranslate(fgColorData.r, fgColorData.g, fgColorData.b, cbTypeObj.type, cbTypeObj.amount);
    bgColorData_adjusted = cbTranslate(bgColorData.r, bgColorData.g, bgColorData.b, cbTypeObj.type, cbTypeObj.amount);
  }
  else {
    fgColorData_adjusted = fgColorData;
    bgColorData_adjusted = bgColorData;
  }
  fgColorData = convertAllFormatsToRGB(fgColorData);
  bgColorData = convertAllFormatsToRGB(bgColorData);
  var contrastRangeObj = {};

  if(channelCase == 'red' || channelCase == 'all') {
    var red_fg_0              = {r:0,   g:fgColorData.g,  b:fgColorData.b};
    var red_fg_255            = {r:255, g:fgColorData.g,  b:fgColorData.b};
    if(cbTypeArg !== 'normal') {
      red_fg_0                = cbTranslate(red_fg_0.r,   red_fg_0.g,   red_fg_0.b,   cbTypeObj.type, cbTypeObj.amount);
      red_fg_255              = cbTranslate(red_fg_255.r, red_fg_255.g, red_fg_255.b, cbTypeObj.type, cbTypeObj.amount);
    }
    // generate fg_red = 0    / fg_red = 255
    var red_fg_0_contrast     = getContrast(red_fg_0,   bgColorData_adjusted, false);
    var red_fg_255_contrast   = getContrast(red_fg_255, bgColorData_adjusted, false);
  }
  if(channelCase == 'green' || channelCase == 'all') {
    var green_fg_0              = {r:fgColorData.r,   g:0,      b:fgColorData.b};
    var green_fg_255            = {r:fgColorData.r,   g:255,    b:fgColorData.b};
    if(cbTypeArg !== 'normal') {
      green_fg_0                = cbTranslate(green_fg_0.r,   green_fg_0.g,   green_fg_0.b,   cbTypeObj.type, cbTypeObj.amount);
      green_fg_255              = cbTranslate(green_fg_255.r, green_fg_255.g, green_fg_255.b, cbTypeObj.type, cbTypeObj.amount);
    }
    // generate fg_green = 0  / fg_green = 255
    var green_fg_0_contrast   = getContrast(green_fg_0,   bgColorData_adjusted, false);
    var green_fg_255_contrast = getContrast(green_fg_255, bgColorData_adjusted, false);
  }

  if(channelCase == 'blue' || channelCase == 'all') {
    var blue_fg_0              = {r:0,   g:fgColorData.g,  b:fgColorData.b};
    var blue_fg_255            = {r:255, g:fgColorData.g,  b:fgColorData.b};
    if(cbTypeArg !== 'normal') {
      blue_fg_0                = cbTranslate(red_fg_0.r,   red_fg_0.g,   red_fg_0.b,   cbTypeObj.type, cbTypeObj.amount);
      blue_fg_255              = cbTranslate(red_fg_255.r, red_fg_255.g, red_fg_255.b, cbTypeObj.type, cbTypeObj.amount);
    }
    // generate fg_red = 0    / fg_red = 255
    var blue_fg_0_contrast     = getContrast(blue_fg_0,   bgColorData_adjusted, false);
    var blue_fg_255_contrast   = getContrast(blue_fg_255, bgColorData_adjusted, false);
  }


  function buildContrastRangeData() {
    var blue_fg_0              = {r:0,   g:fgColorData.g,  b:fgColorData.b};
    var blue_fg_255            = {r:255, g:fgColorData.g,  b:fgColorData.b};
    if(cbTypeArg !== 'normal') {
      blue_fg_0                = cbTranslate(red_fg_0.r,   red_fg_0.g,   red_fg_0.b,   cbTypeObj.type, cbTypeObj.amount);
      blue_fg_255              = cbTranslate(red_fg_255.r, red_fg_255.g, red_fg_255.b, cbTypeObj.type, cbTypeObj.amount);
    }
    // generate fg_red = 0    / fg_red = 255
    var blue_fg_0_contrast     = getContrast(blue_fg_0,   bgColorData_adjusted, false);
    var blue_fg_255_contrast   = getContrast(blue_fg_255, bgColorData_adjusted, false);
  }
}

function getContrastRangeForHSL(fgColorData, bgColorData, cbTypeArg, returnOption) {
  // In this case, the only range measurement used is the saturation setting - at 0% and 100%
  // As a result, while only the H(Hue) and (L)Luminance will actually shift results in the contrast range,
  // Any alterations made to the S(Saturation) will not affect the contrast range.
  
  var cbTypeObj = {};
  if(!cbTypeArg) { cbTypeArg = 'normal'; }
  if(cbTypeArg !== 'normal') { cbTypeObj = cbTypeFilter(cbTypeArg); }
  
  var fgColorData_RGB = convertColorFormat(fgColorData, 'rgb', 'object'),
      fgColorData_HSL = convertColorFormat(fgColorData, 'hsl', 'object'),
      bgColorData_RGB = convertColorFormat(bgColorData, 'rgb', 'object'),
      bgColorData_HSL = convertColorFormat(bgColorData, 'hsl', 'object'),
      fgColorData_RGB_adjusted,
      fgColorData_HSL_adjusted,
      bgColorData_RGB_adjusted,
      bgColorData_HSL_adjusted;

  // resolve colorblindness filtering before processing
  if(cbTypeArg === 'normal') {
    fgColorData_RGB_adjusted = fgColorData_RGB;
    fgColorData_HSL_adjusted = fgColorData_HSL;
    bgColorData_RGB_adjusted = bgColorData_RGB;
    bgColorData_HSL_adjusted = bgColorData_HSL;
  }
  else {
    fgColorData_RGB_adjusted = cbTranslate(fgColorData_RGB.r, fgColorData_RGB.g, fgColorData_RGB.b, cbTypeObj.type, cbTypeObj.amount, false);
    fgColorData_HSL_adjusted = convertColorFormat(fgColorData_RGB_adjusted, 'hsl', 'object');
    bgColorData_RGB_adjusted = cbTranslate(bgColorData_RGB.r, bgColorData_RGB.g, bgColorData_RGB.b, cbTypeObj.type, cbTypeObj.amount, false);
    bgColorData_HSL_adjusted = convertColorFormat(bgColorData_RGB_adjusted, 'hsl', 'object');
  }
  
  // calculate contrast ranges by supersaturation/desaturation of hue, convert to rgb values
  var fgColorData_HSL_superSat  = { h:fgColorData_HSL_adjusted.h, s:0, l:fgColorData_HSL_adjusted.l },
      fgColorData_HSL_deSat     = { h:fgColorData_HSL_adjusted.h, s:1, l:fgColorData_HSL_adjusted.l },
      bgColorData_HSL_superSat  = { h:bgColorData_HSL_adjusted.h, s:0, l:bgColorData_HSL_adjusted.l },
      bgColorData_HSL_deSat     = { h:bgColorData_HSL_adjusted.h, s:1, l:bgColorData_HSL_adjusted.l };

  
  var fgColorData_RGB_superSat    = convertColorFormat(fgColorData_HSL_superSat, 'rgb', 'object');
      fgColorData_RGB_deSat       = convertColorFormat(fgColorData_HSL_deSat,    'rgb', 'object');
      bgColorData_RGB_superSat    = convertColorFormat(bgColorData_HSL_superSat, 'rgb', 'object');
      bgColorData_RGB_deSat       = convertColorFormat(bgColorData_HSL_deSat,    'rgb', 'object');

  // if colorblindness filters are active, convert results to colorblind RGB values
  if(cbTypeArg !== 'normal') {
    fgColorData_RGB_superSat    = cbTranslate(fgColorData_RGB_superSat.r, fgColorData_RGB_superSat.g, fgColorData_RGB_superSat.b, cbTypeObj.type, cbTypeObj.amount, false);
    fgColorData_RGB_deSat       = cbTranslate(fgColorData_RGB_deSat.r,    fgColorData_RGB_deSat.g,    fgColorData_RGB_deSat.b,    cbTypeObj.type, cbTypeObj.amount, false);
    bgColorData_RGB_superSat    = cbTranslate(bgColorData_RGB_superSat.r, bgColorData_RGB_superSat.g, bgColorData_RGB_superSat.b, cbTypeObj.type, cbTypeObj.amount, false);
    bgColorData_RGB_deSat       = cbTranslate(bgColorData_RGB_deSat.r,    bgColorData_RGB_deSat.g,    bgColorData_RGB_deSat.b,    cbTypeObj.type, cbTypeObj.amount, false);
  }

  var contrastRangeObj_forHSL = {};
  var contrastObj_fg_superSat   = getContrast(fgColorData_RGB_superSat, bgColorData_RGB_adjusted, true);
  var contrastObj_fg_deSat      = getContrast(fgColorData_RGB_deSat,    bgColorData_RGB_adjusted, true);
  var contrastObj_bg_superSat   = getContrast(fgColorData_RGB_adjusted, bgColorData_RGB_superSat, true);
  var contrastObj_bg_deSat      = getContrast(fgColorData_RGB_adjusted, bgColorData_RGB_deSat,    true);

  contrastRangeObj_forHSL.fg_superSat  = contrastObj_fg_superSat;
  contrastRangeObj_forHSL.fg_deSat     = contrastObj_fg_deSat;
  contrastRangeObj_forHSL.bg_superSat  = contrastObj_bg_superSat;
  contrastRangeObj_forHSL.bg_deSat     = contrastObj_bg_deSat;

  // [ TASK : develop returnOption support, esp. for debugging purposes. ]
  return contrastRangeObj_forHSL;

}
// END WCAG contrast calculator functions



// START non-WCAG Hue-Contrast Calculator
// these functions represent an experiment in answering "Can I detect the difference in hues?"
// One can have 2 hues which return a WCAG contrast ratio of 1 (no difference) and yet are easily distinguished 
// from one another. This is especially important when designing data-graphics which require color differentiation
// that might be conpromised by different forms of colorblindness. These experimental functions offer a "hue-contrast"
// based on artistic color theory and the HSL model. In Artistic Color Theory, opposites on the color wheel have ben demonstrated to have 
// a strong visual contrast, regardless of their calculated luminosity. Red is said to be opposite of Green, Purple with Yellow,
// Orange with Blue. If one follows this strategy with HSL, however, the opposites of the color wheel are different. Red is 
// most strongly contrasted with Cyan, Green with Magenta, and Yellow with Blue.

getHueContrast(fgColorData, bgColorData) {
  var fgColorData_RGB = convertColorFormat(fgColorData, 'rgb', 'object'),
      fgColorData_HSL = convertColorFormat(fgColorData, 'hsl', 'object'),
      bgColorData_RGB = convertColorFormat(bgColorData, 'rgb', 'object'),
      bgColorData_HSL = convertColorFormat(bgColorData, 'hsl', 'object');

  var fgLum = getLuminance(fgColorData_RGB),
      bgLum = getLuminance(bgColorData_RGB);

  var fgHue = fgColorData_HSL.h,
      bgHue = bgColorData_HSL.h;

  var hueDiff = getHueDiff(fgHue, bgHue);

  var hueContrast = 
}

function getHueDiff(fgHue, bgHue) {
  var hueDiff, hueGreater, hueLesser;
  if(fgHue > bgHue) {
    fgHue = hueGreater;
    bgHue = hueLesser;
  } else if(bgHue > fgHue) {
    bgHue = hueGreater;
    fgHue = hueLesser;
  } else {
    return 0; // no diff
  }
  hueDiff = hueGreater - hueLesser;
  if(hueDiff > 180) {
    hueDiff = (360 - hueGreater) + hueLesser;
  }
  return hueDiff;
}

function calcHueContrast(fgLum, bgLum, hueDiff) {
  var hueContrast, greaterLum, lesserLum;
  if(fgLum >= bgLum) {
    greaterLum = fgLum;
    lesserLum  = bgLum;
  } else if(bgLum > fgLum) {
    greaterLum = bgLum;
    lesserLum  = fgLum;
  } 
  hueContrast = ((greaterLum*hueDiff/180) + 0.05) / ((lesserLum*hueDiff/180) + 0.05);
  return hueContrast;
}

// END non-WCAG Hue-Contrast Calculator



// START colorblindness filters

function getColorblindFilterFor(colorDataArg, cbType, returnOption) {
  // NOTE : colorblindness filters are based on Color.Vision.Simulate (details on open source project below)
  if(!returnOption || returnOption !== true) { returnOption == false } // returnOption === true means return entire object
  
  var returnObj = {},
      colorDataArg_validFormat = convertColorFormat(colorDataArg, 'rgb', 'object'); // autochecks valid color-format/values, alpha less than 1.0/100% = ERROR

  var redValue      = colorDataArg_validFormat.r,
      greenValue    = colorDataArg_validFormat.g,
      blueValue     = colorDataArg_validFormat.b,
      cbTypeObj     = cbTypeFilter(cbType)
      cbColorResult = cbTranslate(redValue, greenValue, blueValue, cbTypeObj.type, cbTypeObj.amount);

  if(returnOption === true) { // returns all information from calculation
    returnObj.colorDataArg              = colorDataArg;
    returnObj.colorDataArg_validFormat  = colorDataArg_validFormat;
    returnObj.cbTypeObj                 = cbTypeObj;
    returnObj.cbColorObj                = cbColorResult;
    return returnObj;
  }
  else { return cbColorResult; } // returns just the color result in rgb/object format
}

/* 

  Origin of Code : Color.Vision.Simulate : v0.1
  
  // (note: pulled from graphics-conversion algorithm)

  -----------------------------
  Freely available for non-commercial use by Matthew Wickline and the
  Human-Computer Interaction Resource Network ( http://hcirn.com/ ).

  "Color-Defective Vision and Computer Graphics Displays" by Gary W. Meyer and Donald P. Greenberg
  http://ieeexplore.ieee.org/iel1/38/408/00007759.pdf?arnumber=7759

  "Spectral sensitivity of the foveal cone photopigments between 400 and 500 nm" by V.C. Smith, J. Pokorny
  http://www.opticsinfobase.org/abstract.cfm?URI=josaa-22-10-2060

  "RGB Working Space Information" by Bruce Lindbloom
  http://www.brucelindbloom.com/WorkingSpaceInfo.html

*/

function cbTypeFilter(nameString) { // converts colorblindness types to cbTranslate compatible formulas
  nameString = nameString.toLowerCase();
  var cbType = '', cbAmount = 1.0;
  switch(nameString) {
    case 'lowred'       :
    case 'low-red'      :
    case 'protanomaly'  : cbType = 'red';   cbAmount = 0.6; break;
    case 'no-red'       :
    case 'nored'        :
    case 'red'          :
    case 'protanope'    :
    case 'protanopia'   : cbType = 'red';                   break;
    case 'lowgreen'     :
    case 'low-green'    :
    case 'deuteranomaly': cbType = 'green'; cbAmount = 0.6; break;
    case 'deuteranope'  :
    case 'no-green'     :
    case 'nogreen'      :
    case 'green'        :
    case 'deuteranopia' : cbType = 'green';                 break;
    case 'lowblue'      :
    case 'low-blue'     :
    case 'tritanomaly'  : cbType = 'blue';  cbAmount = 0.5; break;
    case 'no-blue'      :
    case 'noblue'       :
    case 'blue'         :
    case 'tritanope'    :
    case 'tritanopia'   : cbType = 'blue';                  break;
    case 'lowgray'      :
    case 'low-gray'     :
    case 'lowcolor'     :
    case 'low-color'    :
    case 'achromatomaly': cbType = 'gray';  cbAmount = 0.6; break;
    case 'gray'         :
    case 'nocolor'      :
    case 'no-color'     :
    case 'achromatope'  :
    case 'achromatopsia': cbType = 'gray';                  break; 
    default             :                                   return false;
  }

  return { type: cbType, amount: cbAmount }
}

function cbTranslate(redVal, greenVal, blueVal, type, amount, returnType) {
  
  if(!returnType)   { returnType = 'object';  }
  
  if(!amount && amount !== 0 && amount !== '') { 
    var cbTypeObj = cbTypeFilter(type);
    if(cbTypeObj !== false) {
      type    = cbTypeObj.type;
      amount  = cbTypeObj.amount;
    }
    else {
      console.log('ERROR > cbTranslate() - type argument >>> ' + type + ' <<< is invalid.');
      return false;
    }
  }
  else {
    switch(amount) {
      case 'no'   : amount = 1.0; break;
      case 'low'  : amount = 0.6; break;
      default     : amount = amount.toFixed(2); /* assumes is not a string */
    }
  }

  var ConfusionLines = {
    /* "Protanope" */
    "red":            { x: 0.7465,  y: 0.2535,  m: 1.273463, yint: -0.073894  },
    /* "Deuteranope" */
    "green":          { x: 1.4,     y: -0.4,    m: 0.968437, yint: 0.003331   },
    /* "Tritanope" */
    "blue":           { x: 0.1748,  y: 0.0,     m: 0.062921, yint: 0.292119   }
  };

  if(type == 'gray') { /* "Achromatope" */
    var sr = redVal, 
        sg = greenVal,
        sb = blueVal,
        // convert to Monochrome using sRGB WhitePoint  
        dr = (sr * 0.212656 + sg * 0.715158 + sb * 0.072186), // destination-pixel
        dg = dr,
        db = dr;
        // Anomylize colors
        dr = sr * (1.0 - amount) + dr * amount; 
        dg = sg * (1.0 - amount) + dg * amount;
        db = sb * (1.0 - amount) + db * amount;

    var rgbData = defineReturnDataType(dr, dg, db, returnType);
    return rgbData;
  } 
  else { // all cases that are not Achromatope

    var line = ConfusionLines[type],
                confuse_x = line.x,
                confuse_y = line.y, 
                confuse_m = line.m,
                confuse_yint = line.yint;
    var sr = redVal, // source-pixel
        sg = greenVal,
        sb = blueVal,
        dr = sr, // destination-pixel
        dg = sg,
        db = sb;
    // Convert source color into XYZ color space
    var pow_r = Math.pow(sr, 2.2),
        pow_g = Math.pow(sg, 2.2),
        pow_b = Math.pow(sb, 2.2);
    var X = pow_r * 0.412424 + pow_g * 0.357579 + pow_b * 0.180464, // RGB->XYZ (sRGB:D65)
        Y = pow_r * 0.212656 + pow_g * 0.715158 + pow_b * 0.0721856,
        Z = pow_r * 0.0193324 + pow_g * 0.119193 + pow_b * 0.950444;
    // Convert XYZ into xyY Chromacity Coordinates (xy) and Luminance (Y)
    var chroma_x = X / (X + Y + Z);
    var chroma_y = Y / (X + Y + Z);
    // Generate the “Confusion Line" between the source color and the Confusion Point
    var m = (chroma_y - confuse_y) / (chroma_x - confuse_x); // slope of Confusion Line
    var yint = chroma_y - chroma_x * m; // y-intercept of confusion line (x-intercept = 0.0)
    // How far the xy coords deviate from the simulation
    var deviate_x = (confuse_yint - yint) / (m - confuse_m);
    var deviate_y = (m * deviate_x) + yint;
    // Compute the simulated color’s XYZ coords
    var X = deviate_x * Y / deviate_y;
    var Z = (1.0 - (deviate_x + deviate_y)) * Y / deviate_y;
    // Neutral grey calculated from luminance (in D65)
    var neutral_X = 0.312713 * Y / 0.329016; 
    var neutral_Z = 0.358271 * Y / 0.329016; 
    // Difference between simulated color and neutral grey
    var diff_X = neutral_X - X;
    var diff_Z = neutral_Z - Z;
    diff_r = diff_X * 3.24071 + diff_Z * -0.498571; // XYZ->RGB (sRGB:D65)
    diff_g = diff_X * -0.969258 + diff_Z * 0.0415557;
    diff_b = diff_X * 0.0556352 + diff_Z * 1.05707;
    // Convert to RGB color space
    dr = X * 3.24071 + Y * -1.53726 + Z * -0.498571; // XYZ->RGB (sRGB:D65)
    dg = X * -0.969258 + Y * 1.87599 + Z * 0.0415557;
    db = X * 0.0556352 + Y * -0.203996 + Z * 1.05707;
    // Compensate simulated color towards a neutral fit in RGB space
    var fit_r = ((dr < 0.0 ? 0.0 : 1.0) - dr) / diff_r;
    var fit_g = ((dg < 0.0 ? 0.0 : 1.0) - dg) / diff_g;
    var fit_b = ((db < 0.0 ? 0.0 : 1.0) - db) / diff_b;
    var adjust = Math.max( // highest value
      (fit_r > 1.0 || fit_r < 0.0) ? 0.0 : fit_r, 
      (fit_g > 1.0 || fit_g < 0.0) ? 0.0 : fit_g, 
      (fit_b > 1.0 || fit_b < 0.0) ? 0.0 : fit_b
    );
    // Shift proportional to the greatest shift
    dr = dr + (adjust * diff_r);
    dg = dg + (adjust * diff_g);
    db = db + (adjust * diff_b);
    // Apply gamma correction
    dr = Math.pow(dr, 1.0 / 2.2);
    dg = Math.pow(dg, 1.0 / 2.2);
    db = Math.pow(db, 1.0 / 2.2);
    // Anomylize colors
    dr = sr * (1.0 - amount) + dr * amount; 
    dg = sg * (1.0 - amount) + dg * amount;
    db = sb * (1.0 - amount) + db * amount;
    
    // Return values
    var rgbData = defineReturnDataType(dr, dg, db, returnType);
    return rgbData;
  }
  function defineReturnDataType(redVal, greenVal, blueVal, dataType) {
    if(dataType == 'object') {
      var returnData = {};
      if(redVal   > 255) { redVal   = 255; }
      if(greenVal > 255) { greenVal = 255; }
      if(blueVal  > 255) { blueVal  = 255; }
      returnData.r = redVal   >> 0;
      returnData.g = greenVal >> 0;
      returnData.b = blueVal  >> 0;
      return returnData;
    } else { // returns Array by default
      var returnData = [];
      if(redVal   > 255) { redVal   = 255; }
      if(greenVal > 255) { greenVal = 255; }
      if(blueVal  > 255) { blueVal  = 255; }
      returnData[0] = redVal    >> 0;
      returnData[1] = greenVal  >> 0;
      returnData[2] = blueVal   >> 0;
      return returnData;
    }
  }
}


// END colorblindness filters


// START contrast range calculation

function getContrastRangeFor(fgColorData, bgColorData, channelCase, returnOption) {
  if(!channelCase || channelCase === true)  { channelCase = 'all'; }
  if(returnOption !== false)                { returnOption = true; }
  // options of channelCase --> channelCase { colorChannel: 'red', colorCase: 'fg' }
  // assumes that any filters have already been applied, such as colorblindness

  var returnObj = {};
  returnObj.contrastRanges = {};

  // note: for now, rgb channels are the only available for contrast algorithm data
  var fgColorData_validFormat = convertColorFormat(fgColorData, 'rgb', 'object'), 
      bgColorData_validFormat = convertColorFormat(bgColorData, 'rgb', 'object');

  var fgColorData_validFormat_red_0,    fgColorData_validFormat_red_255,
      fgColorData_validFormat_green_0,  fgColorData_validFormat_green_255,
      fgColorData_validFormat_blue_0,   fgColorData_validFormat_blue_255,
      bgColorData_validFormat_red_0,    bgColorData_validFormat_red_255,
      bgColorData_validFormat_green_0,  bgColorData_validFormat_green_255,
      bgColorData_validFormat_blue_0,   bgColorData_validFormat_blue_255;

  if(channelCase == 'fg-red'   || channelCase == 'red'   || channelCase == 'all' ) {
    fgColorData_validFormat_red_0       = getContrast({ r:0,    g: fgColorData_validFormat.g, b: fgColorData_validFormat.b}, bgColorData_validFormat, false);
    fgColorData_validFormat_red_255     = getContrast({ r:255,  g: fgColorData_validFormat.g, b: fgColorData_validFormat.b}, bgColorData_validFormat, false);
    returnObj.contrastRanges.fg_red_0   = fgColorData_validFormat_red_0;
    returnObj.contrastRanges.fg_red_255 = fgColorData_validFormat_red_255;
  }
  if(channelCase == 'bg-red'   || channelCase == 'red'   || channelCase == 'all' ) {
    bgColorData_validFormat_red_0       = getContrast(fgColorData_validFormat, { r:0,    g: bgColorData_validFormat.g, b: bgColorData_validFormat.b}, false);
    bgColorData_validFormat_red_255     = getContrast(fgColorData_validFormat, { r:255,  g: bgColorData_validFormat.g, b: bgColorData_validFormat.b}, false);
    returnObj.contrastRanges.bg_red_0   = bgColorData_validFormat_red_0;
    returnObj.contrastRanges.bg_red_255 = bgColorData_validFormat_red_255;
  }
  if(channelCase == 'fg-green' || channelCase == 'green' || channelCase == 'all' ) {
    fgColorData_validFormat_green_0     = getContrast({ r: fgColorData_validFormat.r,  g: 0,   b: fgColorData_validFormat.b}, bgColorData_validFormat, false);
    fgColorData_validFormat_green_255   = getContrast({ r: fgColorData_validFormat.r,  g: 255, b: fgColorData_validFormat.b}, bgColorData_validFormat, false);
    returnObj.contrastRanges.fg_green_0   = fgColorData_validFormat_green_0;
    returnObj.contrastRanges.fg_green_255 = fgColorData_validFormat_green_255;
  }
  if(channelCase == 'bg-green' || channelCase == 'green' || channelCase == 'all' ) {
    bgColorData_validFormat_green_0     = getContrast(fgColorData_validFormat, { r:bgColorData_validFormat.r,  g: 0,    b: bgColorData_validFormat.b}, false);
    bgColorData_validFormat_green_255   = getContrast(fgColorData_validFormat, { r:bgColorData_validFormat.r,  g: 255,  b: bgColorData_validFormat.b}, false);
    returnObj.contrastRanges.bg_green_0   = bgColorData_validFormat_green_0;
    returnObj.contrastRanges.bg_green_255 = bgColorData_validFormat_green_255;
  }
  if(channelCase == 'fg-blue'  || channelCase == 'blue'  || channelCase == 'all' ) {
    fgColorData_validFormat_blue_0      = getContrast({ r: fgColorData_validFormat.r,  g:fgColorData_validFormat.g, b: 0    }, bgColorData_validFormat, false);
    fgColorData_validFormat_blue_255    = getContrast({ r: fgColorData_validFormat.r,  g:fgColorData_validFormat.g, b: 255  }, bgColorData_validFormat, false);
    returnObj.contrastRanges.fg_blue_0   = fgColorData_validFormat_blue_0;
    returnObj.contrastRanges.fg_blue_255 = fgColorData_validFormat_blue_255;
  }
  if(channelCase == 'bg-blue'  || channelCase == 'blue'  || channelCase == 'all' ) {
    bgColorData_validFormat_blue_0      = getContrast(fgColorData_validFormat, { r:bgColorData_validFormat.r,  g:bgColorData_validFormat.g, b: 0    },  false);
    bgColorData_validFormat_blue_255    = getContrast(fgColorData_validFormat, { r:bgColorData_validFormat.r,  g:bgColorData_validFormat.g, b: 255  },  false);
    returnObj.contrastRanges.bg_blue_0   = bgColorData_validFormat_blue_0;
    returnObj.contrastRanges.bg_blue_255 = bgColorData_validFormat_blue_255;
  }
  if(returnOption === true) { // returns all related data as opposed to only contrastRange object
    returnObj.fgColorData = fgColorData;
    returnObj.bgColorData = bgColorData;
    returnObj.fgColorData_validFormat = fgColorData_validFormat;
    returnObj.bgColorData_validFormat = bgColorData_validFormat;
    returnObj.channelCase = channelCase;
    return returnObj;
  } else { return returnObj.contrastRanges; }
}

// collects contrast-range conditions for all vision-types
function getContrastRangesForAll(fgColorData, bgColorData, returnOption) {
  if(!returnOption) { returnOption = false; }

  var contrastObj = {},
      contrastRange_normal,
      contrastRange_noRed,
      contrastRange_lowRed,
      contrastRange_noGreen,
      contrastRange_lowGreen,
      contrastRange_noBlue,
      contrastRange_lowBlue,
      contrastRange_noColor,
      contrastRange_lowColor;
  
  contrastRange_normal    = getContrastRangeFor(fgColorData, bgColorData, 'all', true);
  contrastRange_noRed     = getContrastRangeFor(getColorblindFilterFor(fgColorData, 'no-red', false),    getColorblindFilterFor(bgColorData, 'no-red',     false), 'all', true);
  contrastRange_lowRed    = getContrastRangeFor(getColorblindFilterFor(fgColorData, 'low-red', false),   getColorblindFilterFor(bgColorData, 'low-red',    false), 'all', true);
  contrastRange_noGreen   = getContrastRangeFor(getColorblindFilterFor(fgColorData, 'no-green', false),  getColorblindFilterFor(bgColorData, 'no-green',   false), 'all', true);
  contrastRange_lowGreen  = getContrastRangeFor(getColorblindFilterFor(fgColorData, 'low-green', false), getColorblindFilterFor(bgColorData, 'low-green',  false), 'all', true);
  contrastRange_noBlue    = getContrastRangeFor(getColorblindFilterFor(fgColorData, 'no-blue', false),   getColorblindFilterFor(bgColorData, 'no-blue',    false), 'all', true);
  contrastRange_lowBlue   = getContrastRangeFor(getColorblindFilterFor(fgColorData, 'low-blue', false),  getColorblindFilterFor(bgColorData, 'low-blue',   false), 'all', true);
  contrastRange_noColor   = getContrastRangeFor(getColorblindFilterFor(fgColorData, 'no-color', false),  getColorblindFilterFor(bgColorData, 'no-color',   false), 'all', true); 
  contrastRange_lowColor  = getContrastRangeFor(getColorblindFilterFor(fgColorData, 'low-color', false), getColorblindFilterFor(bgColorData, 'low-color',  false), 'all', true);
  
  contrastObj.normal    = contrastRange_normal;
  contrastObj.noRed     = contrastRange_noRed;
  contrastObj.lowRed    = contrastRange_lowRed;
  contrastObj.noGreen   = contrastRange_noGreen;
  contrastObj.lowGreen  = contrastRange_lowGreen;
  contrastObj.noBlue    = contrastRange_noBlue;
  contrastObj.lowBlue   = contrastRange_lowBlue;
  contrastObj.noColor   = contrastRange_noColor;
  contrastObj.lowColor  = contrastRange_lowColor;

  if(returnOption === false) {
    return contrastObj;
  } else {
    // not currently available
  }
}

// END contrast range calculation


// START tools

// function getLuminance( channelVal_1, channelVal_2, channelVal_3, colorType ) { // 
//   if(!colorType) { colorType = 'rgb'}
//   if(colorType == 'rgb') {
//     return 0.2126*useLuminanceMultiplier(redValue) + 0.7152*useLuminanceMultiplier(greenValue) + 0.0722*useLuminanceMultiplier(blueValue);
//   }
// }

function getLuminance( colorData, colorType, returnOption ) { // defaults to rgb, must state colorType if not rgb
  if(!colorType) { colorType == 'rgb'}
  if(!returnOption) { returnOption = false; }
  var redValue, greenValue, blueValue;
  var colorObj = {}, lumResult;
  if(colorType      == 'rgb')   { colorObj = colorData; }
  else if(colorType == 'hsl')   { colorObj = hslToRgb(colorData.h, colorData.s, colorData.l); }
  else if(colorType == 'hex')   { colorObj = hexToRgb(colorData); }
  else { console.log('ERROR > getLuminance() has invalid colorType'); return false; }
  
  var rLumX, gLumX, bLumX;
  function initLumCalc() {
    rLumX   = applyLumMultiplier(colorObj.r),
    gLumX   = applyLumMultiplier(colorObj.g),
    bLumX   = applyLumMultiplier(colorObj.b);
    return 0.2126 * rLumX + 0.7152 * gLumX + 0.0722 * bLumX;
  }

  lumResult = initLumCalc();

  if(returnOption) {  // returns all luminance calc data, necessary for calculating fail-range
    var lumDataObj    = {};
    lumDataObj.lum    = lumResult;
    lumDataObj.rLumX  = rLumX;
    lumDataObj.gLumX  = gLumX;
    lumDataObj.bLumX  = bLumX;
    return lumDataObj;
  } else {
    return lumResult;
  }
}

function applyLumMultiplier(colorChanArg) { // function is exposed to be tool for several cases
  var multiplier;
  var convNum = colorChanArg / 255;
  multiplier = (convNum <= 0.03928) ? convNum / 12.92 : Math.pow(((convNum + 0.055) / 1.055), 2.4);
  return multiplier;
}

function removeLumMultiplier(multiplierValueArg, normalizeOption) { // function is exposed to be tool for several cases
  if(!normalizeOption && normalizeOption !== false) { normalizeOption = true; }
  var originalValue;
  // var convNum = colorChanArg / 255;
  originalValue = (multiplierValueArg <= 0.0031) ? multiplierValueArg * 255 * 12.92 : 255 * ( 1.055 * ( Math.pow(multiplierValueArg, 1/2.4)  ) - 0.055);
  originalValue = Math.round(originalValue);
  if(normalizeOption === true) {
    originalValue = normalizefailRangeResult(originalValue, 'rgb');
  }
  return originalValue;
}

function normalizefailRangeResult(failValueArg, colorType) {
  if(!colorType) { colorType = 'rgb'; } 
  if(colorType == 'rgb') {
    if(failValueArg < 0)    { failValueArg = -1; } // interpreted as "too low for consideration"
    if(failValueArg > 255)  { failValueArg = 256 } // interpreted as "too high for consideration"
  }
  return failValueArg;
}

function defineGreaterLuminance(fgLum, bgLum) {
  if( fgLum > bgLum )   { return 'foreground'   };
  if( fgLum < bgLum )   { return 'background'     };
  if( fgLum == bgLum )  { return 'equal'  };
  return null;
}

function removeLumMultiplier(multiplierValueArg, normalizeOption) { // function is exposed to be tool for several cases
  if(!normalizeOption && normalizeOption !== false) { normalizeOption = true; }
  var originalValue;
  // var convNum = colorChanArg / 255;
  originalValue = (multiplierValueArg <= 0.0031) ? multiplierValueArg * 255 * 12.92 : 255 * ( 1.055 * ( Math.pow(multiplierValueArg, 1/2.4)  ) - 0.055);
  originalValue = Math.round(originalValue);
  if(normalizeOption === true) {
    originalValue = normalizefailRangeResult(originalValue, 'rgb');
  }
  return originalValue;
}

function normalizefailRangeResult(failValueArg, colorType) {
  if(!colorType) { colorType = 'rgb'; } 
  if(colorType == 'rgb') {
    if(failValueArg < 0)    { failValueArg = -1; } // interpreted as "too low for consideration"
    if(failValueArg > 255)  { failValueArg = 256 } // interpreted as "too high for consideration"
  }
  return failValueArg;
}

function convertAllFormatsToRGB(colorDataArg) {
  var thisColorType = defineColorType(colorDataArg);
  if(thisColorType != 'rgb') {
    switch(colorDataArg) {
      case 'rgba'   :
        console.log('ERROR > convertAllFormatsToRGB() does not currently support autoconversion of rgba format.')
        break;
      case 'hsl'    :
        colorDataArg = hslToRgb(colorDataArg);
        break;
      case 'hsla'    :
        console.log('ERROR > convertAllFormatsToRGB() does not currently support autoconversion of hsla format.')
        break;
      case 'hex'    :
        colorDataArg = hexToRgb(colorDataArg);
        break;
      default       :
        console.log('ERROR > convertAllFormatsToRGB() failed.')
        return false;
    }
  }
  return colorDataArg;
}

// END tools




