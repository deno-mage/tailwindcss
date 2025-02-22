import { MageApp } from "@mage/app";
import { tailwindcss } from "../../tailwindcss.ts";

export const app = new MageApp();

app.plugin(tailwindcss({
  entry: "./plugin/tests/fixtures/entry.css",
  output: "./plugin/tests/fixtures/output.css",
}));

app.develop();
