// colorblindness.js
/* 
  Color.Vision.Simulate : v0.1
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
    case 'red'          :
    case 'protanope'    :
    case 'protanopia'   : cbType = 'red';                   break;
    case 'lowgreen'     :
    case 'low-green'    :
    case 'deuteranomaly': cbType = 'green'; cbAmount = 0.6; break;
    case 'deuteranope'  :
    case 'green'        :
    case 'deuteranopia' : cbType = 'green';                 break;
    case 'lowblue'      :
    case 'low-blue'     :
    case 'tritanomaly'  : cbType = 'blue';  cbAmount = 0.25; break;
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


