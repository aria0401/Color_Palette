"use strict";

window.addEventListener("load", start);

let selectedOption;

function start() {
  getColorFromUser();
  document
    .querySelector("select#each_input")
    .addEventListener("change", selected);
}

function selected() {
  selectedOption = this.value;
}

function getColorFromUser() {
  let colorWell = document.querySelector("#selector");
  colorWell.addEventListener("input", getColorValue);
}

function getColorValue(event) {
  let selectedColor = event.target.value;
  convertInput(selectedColor);
  return selectedColor;
}

function convertInput(hex) {
  let RGB = hexToRGB(hex);
  let HSL = rgbToHsl(RGB);
  let arrayHSL = getHarmony(HSL); //returns an array of hsl objects
  theDelegator(arrayHSL);
}

function hexToRGB(hex) {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5), 16);

  return { r, g, b };
}

function rgbToHex(obj) {
  let r = obj.r.toString(16).padStart(2, "0");
  let g = obj.g.toString(16).padStart(2, "0");
  let b = obj.b.toString(16).padStart(2, "0");
  let HEXcolor = `#${r}${g}${b}`;

  return HEXcolor;
}

function rgbToHsl(obj) {
  let r = obj.r;
  let g = obj.g;
  let b = obj.b;

  r /= 255;
  g /= 255;
  b /= 255;

  let h, s, l;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = 60 * (0 + (g - b) / (max - min));
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min));
  } else if (max === b) {
    h = 60 * (4 + (r - g) / (max - min));
  }

  if (h < 0) {
    h = h + 360;
  }

  l = (min + max) / 2;

  if (max === 0 || min === 1) {
    s = 0;
  } else {
    s = (max - l) / Math.min(l, 1 - l);
  }
  // multiply s and l by 100 to get the value in percent, rather than [0,1]
  s *= 100;
  l *= 100;

  h = Math.floor(h);
  s = Math.floor(s);
  l = Math.floor(l);

  return { h, s, l };
}

function hslToRGB(hsl) {
  let h = hsl.h;
  let s = hsl.s;
  let l = hsl.l;
  h = h;
  s = s / 100;
  l = l / 100;
  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

function getHarmony(HSL) {
  let arrayHSL = analogous(HSL);

  if (selectedOption === "analogous") {
    arrayHSL = analogous(HSL);
  } else if (selectedOption === "monochromatic") {
    arrayHSL = monochromatic(HSL);
  } else if (selectedOption === "triad") {
    arrayHSL = triad(HSL);
  } else if (selectedOption === "shades") {
    arrayHSL = shades(HSL);
  } else if (selectedOption === "complementary") {
    arrayHSL = complementary(HSL);
  }

  return arrayHSL;
}

function analogous(HSL) {
  let h = HSL.h;
  let s = HSL.s;
  let l = HSL.l;

  let arrayOfHslValues = [
    { h: h - 20, s, l },
    { h: h - 10, s, l },
    { h, s, l },
    { h: h + 10, s, l },
    { h: h + 20, s, l },
  ];

  return arrayOfHslValues;
}

function monochromatic(HSL) {
  let h = HSL.h;
  let s = HSL.s;
  let l = HSL.l;

  let arrayOfHslValues = [
    { h, s: s - 40, l },
    { h, s: s - 20, l },
    { h, s, l },
    { h, s: s + 20, l },
    { h, s: +40, l },
  ];

  return arrayOfHslValues;
}

function triad(HSL) {
  let h = HSL.h;
  let s = HSL.s;
  let l = HSL.l;

  let arrayOfHslValues = [
    { h, s, l: l + 10 },
    { h, s, l: l + 20 },
    { h, s, l },
    { h: h + 60, s, l },
    { h: h + 180, s, l },
  ];

  return arrayOfHslValues;
}

function shades(HSL) {
  let h = HSL.h;
  let s = HSL.s;
  let l = HSL.l;

  let arrayOfHslValues = [
    { h, s, l: l - 30 },
    { h, s, l: l - 20 },
    { h, s, l },
    { h, s, l: l + 20 },
    { h, s, l: l + 30 },
  ];

  return arrayOfHslValues;
}

function complementary(HSL) {
  let h = HSL.h;
  let s = HSL.s;
  let l = HSL.l;

  let arrayOfHslValues = [
    { h: +10, s, l: l - 30 },
    { h: +40, s, l },
    { h, s, l },
    { h: h + 90, s, l },
    { h: h + 180, s, l: l + 30 },
  ];

  return arrayOfHslValues;
}

function theDelegator(myArrayHSL) {
  let array = [];
  myArrayHSL.forEach((hsl) => {
    let myRGB = hslToRGB(hsl);
    array.push(myRGB);
    return array;
  });
  showingTextHsl(myArrayHSL);
  showingTextRgb(array);
  showColorInBox(array);
  showingTextHex(array);
}

function showColorInBox(colors) {
  let array = [];
  colors.forEach((rgb) => {
    let myHEX = rgbToHex(rgb);
    array.push(myHEX);
  });

  let displays = document.querySelectorAll(".viewer");
  for (let i = 0; i < 5; i++) {
    displays[i].style.backgroundColor = array[i];
  }
}

function showingTextHex(myRGB) {
  let array = [];

  myRGB.forEach((rgb) => {
    let myHEX = rgbToHex(rgb);
    array.push(myHEX);
  });
  let txtHEX = document.querySelectorAll(".hex");
  for (let i = 0; i < 5; i++) {
    txtHEX[i].textContent = array[i];
  }
}

function showingTextHsl(HSL) {
  let array = [];
  HSL.forEach((obj) => {
    let h = obj.h;
    let s = obj.s;
    let l = obj.l;
    let HSLvalue = `${h}, ${s}%, ${l}%`;
    array.push(HSLvalue);
  });
  let txtHSL = document.querySelectorAll(".hsl");
  for (let i = 0; i < 5; i++) {
    txtHSL[i].textContent = array[i];
  }
}

function showingTextRgb(RGB) {
  let array = [];
  RGB.forEach((obj) => {
    let r = obj.r;
    let g = obj.g;
    let b = obj.b;
    let RGBvalue = `${r}, ${g}, ${b}`;
    array.push(RGBvalue);
  });

  let txtRGB = document.querySelectorAll(".rgb");
  for (let i = 0; i < 5; i++) {
    txtRGB[i].textContent = array[i];
  }
}
