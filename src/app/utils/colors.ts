function hsbToHex(hue: number, saturation: number, brightness: number): string {
  const rgb = hsbToRgb(hue, saturation, brightness);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  return hex;
}

function hexToHsb(hex: string) {
  const rgb = hexToRgb(hex);
  const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
  return hsb;
}

function hsbToRgb(hue: number, saturation: number, brightness: number) {
    saturation /= 100;
    brightness /= 100;
    const k = (n: number) => (n + hue / 60) % 6;
    const f = (n: number) => brightness * (1 - saturation * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return {r: 255 * f(5), g: 255 * f(3), b: 255 * f(1)};
}

function rgbToHsb(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    switch (max) {
      case r: hue = 60 * (((g - b) / delta) % 6); break;
      case g: hue = 60 * (((b - r) / delta) + 2); break;
      case b: hue = 60 * (((r - g) / delta) + 4); break;
    }
  }
  if (hue < 0) hue += 360;

  const saturation = (max === 0 ? 0 : delta / max)*100;
  const brightness = max*100/255;

  return {hue, saturation, brightness};
}

function rgbToHex(r: number, g: number, b: number): string {
  const hex = ((Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16);
  return "#" + hex.padStart(6, "0").toUpperCase();
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return {r, g, b};
};

export { hsbToHex, hexToHsb, hsbToRgb, rgbToHsb, rgbToHex, hexToRgb };