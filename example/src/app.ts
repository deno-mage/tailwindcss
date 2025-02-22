import { resolve } from "@std/path";
import { MageApp } from "@mage/app";
import { serveFiles } from "@mage/app/serve-files";
import { tailwindcss } from "../../plugin/tailwindcss.ts";

export const app = new MageApp();

app.plugin(tailwindcss({
  entry: "./example/src/main.css",
  output: "./example/public/main.css",
}));

app.get("/", (c) => {
  c.html(`<link rel="stylesheet" href="/public/main.css">
    <h1 class="page-title">Hello, world!!!</h1>`);
});

app.get(
  "/public/*",
  serveFiles({
    directory: resolve(Deno.cwd(), "example/public"),
  }),
);
