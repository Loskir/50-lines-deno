import { processImage } from "./lib.ts";

await Deno.writeFile(
  "image.png",
  await processImage(
    "https://potokmedia.ru/wp-content/uploads/2021/08/scale_1200.jpg",
  ),
);
