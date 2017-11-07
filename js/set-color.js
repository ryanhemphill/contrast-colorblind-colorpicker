// set-color.js




// START convert color functions
function convertColorFormat(colorData, desiredColorType, desiredDataType) {
  if(!desiredColorType)                                     { desiredColorType  = 'rgba';   }
  if(desiredColorType == 'hex'  || desiredDataType == 'css')    { desiredDataType = 'string'; }
  if(!desiredDataType)                                      { desiredDataType = 'object'; }
  // colorType options = 'hex','rgb','rgba','hsl','hsla'
  // desiredDataType  = 'css'>'string', 'object', 'array'

  var colorData_formatted = {}, colorData_result, colorData_converted; // 
  desiredDataType   = desiredDataType.toLowerCase();
  desiredColorType  = desiredColorType.toLowerCase();

  // convert colorData_result to reflect desiredDataType?
  if(desiredDataType == 'object')   { colorData_result = {}; } // object/array values presented as numbers, not strings, unless hex values
  if(desiredDataType == 'array' )   { colorData_result = []; } 
  if(desiredDataType == 'string')   { colorData_result = ''; }
  
  // define current data format
  var colorData_dataType  = defineDataType(colorData);
  // define current colorType
  var colorData_colorType = defineColorType(colorData, colorData_dataType);
  // based on knowing current colorFormat and dataFormat and the desiredColorType/desiredDataType, get results
  var colorData_converted = reformatColor(colorData, colorData_colorType, colorData_dataType, desiredColorType, desiredDataType);
  
  return colorData_converted;
}

function reformatColor(colorDataArg, currentColorFormat, currentDataType, desiredColorType, desiredDataType) {
  
  switch(desiredDataType) {
    case 'css'      : // 'css' translates as 'string'. css-style formatting will be applied.
    case 'string'   : colorData_desired = ''; desiredDataType = 'string'; break;
    case 'array'    : colorData_desired = [];                               break;
    case 'object'   : colorData_desired = {};                               break;
  }

  // START convert colorDataArg to object format, regardless of source
  if(currentDataType == 'string') {
    if(currentColorFormat == 'hex') {
      colorDataArg = hexToRgb(colorDataArg);
    } 
    else { // if it's a string and not hex, then it's a css > rgb/rgba/hsl/hsla, convert to colorObj
      colorDataArg = parseCssColorVal(colorDataArg);
      currentColorFormat = currentColorFormat.replace('css-', '');
      currentDataType    = 'object';
    }
  }
  else if(currentDataType == 'array') {
    colorDataArg = convertColorArrayToObject(colorDataArg, currentColorFormat);
  }
  colorData_object = colorDataArg; // set colorData_object = colorDataArg as default, update as required.
  // END convert colorDataArg to object format

  // START conversion of colorDataArg to colorData_object (based on desiredColorType param)
  if(currentColorFormat == 'rgb' || currentColorFormat == 'rgba' || currentColorFormat == 'hex') {
    // if(currentColorFormat == 'rgb' && desiredColorType == 'hex') { colorDataArg = rgbToHex(colorDataArg); }
    if(desiredColorType == 'rgb' || desiredColorType   == 'rgba' || desiredColorType   == 'hex') {
      colorData_object = colorDataArg;
      if(desiredColorType == 'rgba') { 
        if(colorDataArg.a >= 1 || (!colorDataArg.a && colorDataArg.a !== 0)) {
          colorData_object.a = 1.0; // normalize alpha channel at value of 1
        }
        else { colorData_object.a = colorDataArg.a; }
      } 
      else if(desiredColorType != 'rgba' && colorDataArg.a < 1) {
        console.log('ERROR > reformatColor() does not support conversion of rgba to non-alpha formats when alpha !>= 1');
        return false;
      } 
      if(desiredColorType == 'hex') {
        // colorData_object = rgbToHex(colorDataArg.r, colorDataArg.g, colorDataArg.b);
        if(currentColorFormat == 'rgb' || (currentColorFormat == 'rgba' && colorDataArg.a == 1)) {
          colorData_object = rgbToHex(colorDataArg.r, colorDataArg.g, colorDataArg.b);
        } else {
          console.log('ERROR > reformatColor() does not support conversion of rgba to hex when alpha != 1');
          return false;
        }
      }
    } 
    else if(desiredColorType == 'hsl' || desiredColorType == 'hsla') {
      if(currentColorFormat == 'hex' || currentColorFormat == 'rgb' || currentColorFormat == 'rgba') {
        colorData_object = rgbToHsl(colorDataArg.r, colorDataArg.g, colorDataArg.b);
        if(desiredColorType == 'hsla') {
          if(currentColorFormat == 'rgba') {
            colorData_object.a = colorDataArg.a;
          } 
        }
        else if(desiredColorType == 'hsl') {
          if(currentColorFormat == 'rgba') {
            if(colorDataArg.a < 1) {
              console.log('ERROR > reformatColor() does not support conversion of rgba to hsl when alpha != 1');
              return false;
            } 
            else { colorData_object.a = 1.0; }  // add alpha channel at value of 1 before converting
          }
        }
      }
    }
  }
  
  else if(currentColorFormat == 'hsl' || currentColorFormat == 'hsla') {
    if(desiredColorType == 'rgb' || desiredColorType == 'rgba' || desiredColorType == 'hex') {
      
      colorData_object = hslToRgb(colorDataArg.h, colorDataArg.s, colorDataArg.l);
      
      if(desiredColorType == 'rgba') {
        if(currentColorFormat == 'hsla') { colorData_object.a = colorDataArg.a; }
        else { colorData_object.a = 1.0; } // add alpha channel at value of 1 before converting
      }
      else if(desiredColorType != 'rgba' && colorDataArg.a < 1) {
        console.log('ERROR > reformatColor() does not support conversion of hsla to hex when alpha != 1');
        return false;
      }
      
      if(desiredColorType == 'hex') {
        if(currentColorFormat == 'hsl' || (currentColorFormat == 'hsla' && colorDataArg.a == 1)) {
          colorData_object = hslToHex(colorDataArg.h, colorDataArg.s, colorDataArg.l);
        } else {
          console.log('ERROR > reformatColor() does not support conversion of hsla to hex when alpha != 1');
          return false;
        }
      }
      
    } 
    else if(desiredColorType == 'hsl' || desiredColorType == 'hsla') {
      colorData_object == colorDataArg;
      colorData_object.h = Number(colorData_object.h);
      colorData_object.s = Number(colorData_object.s);
      colorData_object.l = Number(colorData_object.l);

      if(desiredColorType == 'hsla') {
        if(colorDataArg.a || colorDataArg.a === 0) {
          colorData_object.a = Number(colorDataArg.a);
        } 
        else { colorData_object.a = 1.0; } // add alpha channel at value of 1 before converting
      } 
      else if(desiredColorType == 'hsl' && colorDataArg.a < 1) {
        console.log('ERROR > reformatColor() does not support conversion of hsla to hsl when alpha != 1');
        return false;
      }  
    }
  }
  // END conversion of colorDataArg to colorData_object (based on desiredColorType param)




  // START define colorData_desired from colorData_object result (based on desiredDataType param)
  if(desiredDataType == 'object')     { colorData_desired = colorData_object; }
  else if(desiredDataType == 'array') { // applies only to rgb/rgba/hsl/hsla cases, hex is not supported
    if(desiredColorType != 'hex') {
      colorData_desired = convertColorObjectToArray(colorData_object);
    } 
    else {
      console.log('ERROR > reformatColor() does not support processing hex values as array');
      colorData_desired = false;
    }
  }
  else if(desiredColorType == 'hex' || desiredDataType == 'string') { // css-string will be used to express value
    colorData_desired = constructCssColorVal(colorData_object, desiredColorType);
  }
  // END define colorData_desired from colorData_object result (based on desiredDataType param)



  return colorData_desired;
}
// END convert color functions


// START color-name lookup/estimate functions
function getHexFromColorName(colorNameArg, returnOption) { // returns only hex. cleans/removes spaces in colorNameArg, but nothing else
  if(returnOption !== false) { returnOption = true; }
  var table = getColorTable();
  colorNameArg = colorNameArg.toLowerCase().replace(/\s/gi, '');
  for(i=0; i<table.length; i++)
  {
    if(colorNameArg == table[i].name.toLowerCase()) {
      if(returnOption === true) { return table[i]; } // sends back name and its hex color value
      else if(returnOption === false) { return table[i].hex } // sends back hex value. note: '#' is not included!!! must add separately
    } 
  }
  return false; // no match found.
}

function getClosestColorName(redValue, greenValue, blueValue, returnOption) { // only accepts rgb as separate values
  if(returnOption !== false) { returnOption = true; }
  var closestFitWebColor = false;
  closestFitWebColor = findClosestColorRGB({ r: redValue, g: greenValue, b: blueValue })
  
  function findClosestColorRGB(colorSet) {
    var rgb = colorSet;
    var delta = 3 * 256*256;
    var temp = {r:0, g:0, b:0};
    var nameFound = 'XXXXX';
    var dataSet;
    var table = getColorTable();
    
    for(i=0; i<table.length; i++)
    {
      temp = hexToRgb(table[i].hex);
      // temp = Hex2RGB(table[i].hex);
      if(Math.pow(temp.r-rgb.r,2) + Math.pow(temp.g-rgb.g,2) + Math.pow(temp.b-rgb.b,2) < delta)
      {
        delta = Math.pow(temp.r-rgb.r,2) + Math.pow(temp.g-rgb.g,2) + Math.pow(temp.b-rgb.b,2);
        dataSet = table[i];
        nameFound = table[i].name;
      }
    }
    if(returnOption === false) { return nameFound; } // returns only name as string
    else {                       return dataSet; }   // return name and hex value   
  }
  return closestFitWebColor;
}
// END color-name lookup/estimate functions


// START alphaConversion -- NOTE: only works on rgba-to-rgb objects
function calculateNonAlphaColor(rgbaColor, bgRgbColor) { 
  var rgbaAlpha,
      rgbaRed       = rgbaColor.r,
      rgbaGreen     = rgbaColor.g,
      rgbaBlue      = rgbaColor.b,
      bgRed         = bgRgbColor.r,
      bgGreen       = bgRgbColor.g,
      bgBlue        = bgRgbColor.b;
  if(typeof(rgbaColor.a) == 'string' ) { rgbaColor.a = Number(rgbaColor.a.replace('%','')); } 
  if(rgbaColor.a > 1) { rgbaAlpha = rgbaColor.a * 0.01; } // compensates for cases where value is in percent instead of digital
  else                { rgbaAlpha = rgbaColor.a;        }

  var calculatedRed, calculatedGreen, calculatedBlue, colorSansAlpha;
  var invertedAlpha = 1 - rgbaAlpha;
  var calculatedRed   = Math.round((rgbaAlpha * (rgbaRed   / 255) + (invertedAlpha * (bgRed   / 255))) * 255);
  var calculatedGreen = Math.round((rgbaAlpha * (rgbaGreen / 255) + (invertedAlpha * (bgGreen / 255))) * 255);
  var calculatedBlue  = Math.round((rgbaAlpha * (rgbaBlue  / 255) + (invertedAlpha * (bgBlue  / 255))) * 255);
  colorSansAlpha = { r: calculatedRed, g: calculatedGreen, b: calculatedBlue };
  return colorSansAlpha;
}
// END alphaConversion


// START general support tools
function defineDataType(dataArg) {
  if( Array.isArray(dataArg) )       { return 'array';  }
  else if( typeof(dataArg) == 'string' )  { return 'string'; }
  else if( typeof(dataArg) == 'number' )  { return 'number'; }
  else if( typeof(dataArg) == 'object' )  { return 'object'; }
  else { return false; }
}

function defineColorType(colorDataArg, dataType) { 
  // hsl/hlsa is only detected if sat. val is string and includes '%'
  // can only detect difference between rgb and hex by Number vs String dataTypes. Do not present rgb in an object as strings!
  if(!dataType) { dataType = defineDataType(colorDataArg); }
  
  if(dataType == 'array') {
    if(colorDataArg.length == 3) {
      if(defineDataType(colorDataArg[1]) == 'string'      && colorDataArg[1].indexOf('%'))  { return 'hsl'; }
      else if(defineDataType(colorDataArg[0]) == 'string')                                  { return 'hex'; }
      else                                                                                  { return 'rgb'; }
    }
    else if(colorDataArg.length == 4) {
      if(defineDataType(colorDataArg[1]) == 'string' && colorDataArg[1].indexOf('%')) { return 'hsla'; }
      else                                                                            { return 'rgba'; }
    }
    else { return false; }
  } 
  
  else if(dataType == 'object') {
    if(colorDataArg.r || colorDataArg.r === 0) {
      if(colorDataArg.a || colorDataArg.a === 0)          { return 'rgba';  }
      else if(defineDataType(colorDataArg.r) == 'string') { return 'hex';   }
      else                                                { return 'rgb';   }
    }
    else if(colorDataArg.h || colorDataArg.h === 0) {
      if(colorDataArg.a || colorDataArg.a === 0)          { return 'hsla'; }
      else                                                { return 'hsl';  }
    }
  }
  else if(dataType == 'string') {
    // [ TASK : set CSS formatting result ]
    if(colorDataArg.indexOf('rgba(') > -1)       { return 'css-rgba';  } 
    else if(colorDataArg.indexOf('rgb(') > -1)   { return 'css-rgb';   } 
    else if(colorDataArg.indexOf('hsl(') > -1)   { return 'css-hsl';   } 
    else if(colorDataArg.indexOf('hsla(') > -1)  { return 'css-hsla';  }
    else if(colorDataArg.indexOf('#') > -1)      { return 'hex';       }  
  }
  else { return false; }
}

function convertColorArrayToObject(colorArrayArg, colorFormatArg) {
  var colorData_object = {};
  if(colorFormatArg == 'rgb' || colorFormatArg == 'rgba') {
    colorData_object.r = colorArrayArg[0];
    colorData_object.g = colorArrayArg[1];
    colorData_object.b = colorArrayArg[2];
    if(colorArrayArg.length == 4) {
      colorData_object.a = colorArrayArg[3];
    } else if(colorFormatArg == 'rgba') {
      colorData_object.a = 1.0;
    }
  } else if(colorFormatArg == 'hsl' || colorFormatArg == 'hsla') {
    colorData_object.h = colorArrayArg[0];
    colorData_object.s = colorArrayArg[1];
    colorData_object.l = colorArrayArg[2];
    if(colorArrayArg.length == 4) {
      colorData_object.a = colorArrayArg[3];
    } else if(colorFormatArg == 'hsla') {
      colorData_object.a = 1.0;
    }
  } else if(colorFormatArg == 'hex') {
    var hexStringFormat = constructHexString(colorArrayArg);
    colorData_object = hexToRgb(hexStringFormat);
  }
  return colorData_object;
}

function convertColorObjectToArray(colorObjArg) {
  var colorArray = [];
  if(colorObjArg.r || colorObjArg.r === 0) { // rgb/rgba
    colorArray[0] = colorObjArg.r;
    colorArray[1] = colorObjArg.g;
    colorArray[2] = colorObjArg.b;
  } 
  else if(colorObjArg.h || colorObjArg.h === 0) { // hsl/hsla
    colorArray[0] = colorObjArg.h;
    colorArray[1] = colorObjArg.s;
    colorArray[2] = colorObjArg.l;
  }
  if(colorObjArg.a || colorObjArg.a === 0) {
    colorArray[3] = colorObjArg.a;
  }
  return colorArray;
}

function hslToRgb(hueValue, satValue, lumValue) {
  hueValue = Number(hueValue);
  if(hueValue > 1) { hueValue = hueValue/360; }
  satValue = Number(satValue);
  lumValue = Number(lumValue);
  var redValue, greenValue, blueValue;
  if (satValue == 0) { redValue = greenValue = blueValue = lumValue; } // achromatic 
  else {
    function hueToRgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    var q = lumValue < 0.5 ? lumValue * (1 + satValue) : lumValue + satValue - lumValue * satValue;
    var p = 2 * lumValue - q;

    redValue    = hueToRgb(p, q, hueValue + 1/3);
    greenValue  = hueToRgb(p, q, hueValue);
    blueValue   = hueToRgb(p, q, hueValue - 1/3);
  }

  // return [ r * 255, g * 255, b * 255 ];
  redValue    = parseInt(redValue    * 255);
  greenValue  = parseInt(greenValue  * 255);
  blueValue   = parseInt(blueValue   * 255);
  return { r: redValue, g: greenValue, b: blueValue };
}

function hslaToRgba(hueValue, satValue, lumValue, alphaValue) {
  var rgba_object = hslToRgb(hueValue, satValue, lumValue);
  rgba_object.a = alphaValue;
  return rgba_object;
}

function rgbToHsl(redValue, greenValue, blueValue) {
  if(redValue   !== 0)  { redValue    = redValue/255;   }
  if(greenValue !== 0)  { greenValue  = greenValue/255; }
  if(blueValue  !== 0)  { blueValue   = blueValue/255;  }
  var max = Math.max(redValue, greenValue, blueValue), min = Math.min(redValue, greenValue, blueValue);
  var hueValue, satValue, lumValue = (max + min) / 2;

  if (max == min) {
    hueValue = satValue = 0; // achromatic
  } else {
    var difference = max - min;
    satValue = lumValue > 0.5 ? difference / (2 - max - min) : difference / (max + min);

    switch (max) {
      case redValue   : hueValue = (greenValue  - blueValue)  / difference + (greenValue < blueValue ? 6 : 0); break;
      case greenValue : hueValue = (blueValue   - redValue)   / difference + 2; break;
      case blueValue  : hueValue = (redValue    - greenValue) / difference + 4; break;
    }
    hueValue = hueValue/6;
  }
  return { h: hueValue, s: satValue, l: lumValue };
}

function rgbaToHsla(redValue, greenValue, blueValue, alphaValue) {
  var hsla_object = rgbaToHsl(redValue, greenValue, blueValue);
  hsla_object.a = alphaValue;
  return hsla_object;
}

function hexToRgb(hexValue) {
  if (hexValue.lastIndexOf('#') > -1) { hexValue = hexValue.replace(/#/, '0x'); } 
  else { hexValue = '0x' + hexValue; }
  var redValue = hexValue >> 16;
  var greenValue = (hexValue & 0x00FF00) >> 8;
  var blueValue = hexValue & 0x0000FF;
  return {r:redValue, g:greenValue, b:blueValue};
}

function hexToHsl(hexValue) {
  var rgb_object = hexToRgb(hexValue);
  var hsl_object = rgbToHsl(rgb_object.r, rgb_object.g, rgb_object.b );
  return hsla_object;
}

function rgbToHex(redValue, greenValue, blueValue) { // exception: returns string, not object
  redValue = Number(redValue);
  greenValue = Number(greenValue);
  blueValue = Number(blueValue);
  function componentToHex(colorValueArg) {
    var hex = colorValueArg.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  return ("" + componentToHex(redValue) + componentToHex(greenValue) + componentToHex(blueValue)).toUpperCase();
}

function hslToHex(hueValue, satValue, lumValue) { // exception: returns string, not object
  var rgb_object = hslToRgb(hueValue, satValue, lumValue);
  var hexString = rgbToHex(rgb_object.r, rgb_object.g, rgb_object.b);
  return hexString;
}

function constructHexString(hexData) {
  var hexRedValue, hexGreenValue, hexBlueValue;
  if(defineDataType(hexData) == 'array') {
    hexRedValue   = hexData[0];
    hexGreenValue = hexData[1];
    hexBlueValue  = hexData[2];
  } else { // is object
    hexRedValue   = hexData.r;
    hexGreenValue = hexData.g;
    hexBlueValue  = hexData.b;
  }
  return '#' + hexRedValue + hexGreenValue + hexBlueValue;
}


// [ TASK : create regEx cleanup tasks ]
// function normalizeCssColorVal() {
  
// }

function normalizeColorObject(colorDataArg, colorTypeArg) {
  // rgb values
  if(colorDataArg.r > 255)                  { colorDataArg.r = 255; }
  if(colorDataArg.r < 0)                    { colorDataArg.r = 0;   }
  if(colorDataArg.g > 255)                  { colorDataArg.g = 255; }
  if(colorDataArg.g < 0)                    { colorDataArg.g = 0;   }
  if(colorDataArg.b > 255)                  { colorDataArg.b = 255; }
  if(colorDataArg.b < 0)                    { colorDataArg.b = 0;   }
  // hsl values
  if(colorDataArg.h > 360)                  { colorDataArg.h = colorDataArg.h-360; }
  if(colorDataArg.h < 0)                    { colorDataArg.h = 360-colorDataArg.h; }
  if(colorDataArg.s > 1)                    { colorDataArg.s = 1;   }
  if(colorDataArg.s < 0)                    { colorDataArg.s = 0;   }
  if(colorDataArg.l > 1)                    { colorDataArg.l = 1;   }
  if(colorDataArg.l < 0)                    { colorDataArg.l = 0;   }
  // alpha values
  if(colorDataArg.a > 1)                    { colorDataArg.a = 1.0  }
  if(colorDataArg.a < 0)                    { colorDataArg.a = 0.0  } 
}

function parseCssColorVal(cssColorValue) { // returns color object
  var colorSansWrapper, colorArray, colorObject = {};
  // rgb/rgba parse
  if(cssColorValue.indexOf('rgb') > -1) {
    colorSansWrapper = cssColorValue.replace('rgb(', '').replace('rgba(', '').replace(')', '');
    colorArray = colorSansWrapper.split(',');
    // [ TASK : convert to number/integers, strings are no good ]
    colorObject.r = colorArray[0];
    colorObject.g = colorArray[1];
    colorObject.b = colorArray[2];
    if(colorArray.length == 4) {
      colorObject.a = Number(colorArray[3]).toFixed(2);
    }
  }
  
  // hsl/hsla parse
  else if(cssColorValue.indexOf('hsl') > -1) {
    colorSansWrapper = cssColorValue.replace('hsl(', '').replace('hsla(', '').replace(')', '').replace(/%/gi, '');
    colorArray = colorSansWrapper.split(',');
    // [ TASK : convert to hue val to integer, alpha to decimal number (do not leave as string) ]
    colorObject.h = Number(colorArray[0]/1).toFixed(0);
    colorObject.s = Number(colorArray[1]/100).toFixed(3);
    colorObject.l = Number(colorArray[2]/100).toFixed(3);
    if(colorArray.length == 4) {
      colorObject.a = Number(colorArray[3]/1).toFixed(2);
    }
  }

  // hex parse
  else if(cssColorValue.indexOf('#') > -1) {
    colorSansWrapper = cssColorValue.replace('#', '');
    colorObject = hexToRgb(colorSansWrapper);
  }
  else { 
    console.log('ERROR > parseCssColorVal() unable to parse value: ' + cssColorValue);
    return false
  }
  return colorObject;  
}

function constructCssColorVal(colorDataArg, colorTypeArg) { // only accepts objects
  var cssString = '';
  // rgb / rgba
  if(colorTypeArg == 'rgb' || colorTypeArg == 'rgba') {
    cssString = colorTypeArg + '(' + colorDataArg.r + ',' + colorDataArg.g + ',' + colorDataArg.b;
    if(colorTypeArg == 'rgba') {
      cssString = cssString + ',' + colorDataArg.a;
    }
    cssString = cssString + ')';
  }
  // hsl / hsla
  else if(colorTypeArg == 'hsl' || colorTypeArg == 'hsla') {
    if(colorDataArg.h > 1) { colorDataArg.h = colorDataArg.h/360; } // normalize
    cssString = colorTypeArg + '(' + Number(colorDataArg.h * 360).toFixed(0) + ',' + Number(colorDataArg.s * 100).toFixed(1) + '%,' + Number(colorDataArg.l * 100).toFixed(1) + '%';
    if(colorTypeArg == 'hsla') {
      if(colorDataArg.a || colorDataArg.a === 0) {
        cssString = cssString + ',' + Number(colorDataArg.a).toFixed(2);
      } 
      else {
        cssString = cssString + ',' + 1.0;
      }
      
    }
    cssString = cssString + ')';
  }
  // hex
  else if(colorTypeArg == 'hex') {
    if(defineDataType(colorDataArg) == 'string') {
      cssString = colorDataArg;
    }
    if(defineDataType(colorDataArg) == 'object') {
      cssString = colorDataArg.r + colorDataArg.g + colorDataArg.b;
    } 
    else if(defineDataType(colorDataArg) == 'array') {
      cssString = colorDataArg[0] + colorDataArg[1] + colorDataArg[2];
    }
    cssString = '#' + cssString;
  }
  return cssString;
}

function getColorTable() { 
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
  return ColorTable;
}

// END general tools