import {
  createCanvas,
  loadImage,
} from "https://deno.land/x/canvas@v1.4.1/mod.ts";

const decel = (x: number) => 1 - (x - 1) * (x - 1); // easing

export const processImage = async (url: string) => {
  const img = await loadImage(url);

  const drawStart = Date.now();

  const HEIGHT = 750;

  const imageWidth = Math.floor(img.width() * HEIGHT / img.height());
  const imageHeight = HEIGHT;

  const sourceCanvas = createCanvas(imageWidth, imageHeight);
  const resultCanvas = createCanvas(imageWidth, imageHeight);
  const sourceCtx = sourceCanvas.getContext("2d");
  const resultCtx = resultCanvas.getContext("2d");

  resultCtx.fillStyle = "white";
  resultCtx.fillRect(0, 0, imageWidth, imageHeight);

  sourceCtx.drawImage(img, 0, 0, imageWidth, imageHeight);

  const imgd = sourceCtx.getImageData(0, 0, imageWidth, imageHeight);
  const pix = imgd.data;

  const p1 = Date.now()

  for (let y = 0; y < 50; ++y) {
    resultCtx.beginPath();
    resultCtx.lineWidth = 2;
    resultCtx.lineJoin = "round";

    const gy = (y * imageHeight / 50 + 6)

    let l = 0;

    for (let x = 0; x < imageWidth; ++x) {
      const i = (gy * imageWidth + x) * 4
      const c = pix[i + 3] === 0
        ? 255
        : pix[i] * .3 + pix[i + 1] * .59 + pix[i + 2] * .11;

      const m = (255 - c) / 255;
      l += m

      resultCtx.lineTo(
        x,
        (y + 0.5) * imageHeight / 50 + Math.sin(l * Math.PI / 2) * 5 * decel(m),
      );
    }
    resultCtx.stroke();
  }

  const buf = resultCanvas.toBuffer();
  console.log(`draw took ${Date.now() - drawStart}ms, 1 ${p1 - drawStart}ms, 2 ${Date.now() - p1}`);
  return buf
};
