<p align="center" style="color: #343a40">
  <img src="https://raw.githubusercontent.com/deno-mage/server/main/mage.png" alt="Emotion logo" height="150" width="150">
  <h1 align="center">Mage</h1>
</p>
<div align="center">
  Build web applications with <a href="https://deno.com">Deno</a>
</div>

## Mage Tailwindcss

[Tailwindcss](https://tailwindcss.com) plugin for Mage.

### Getting started

Install the plugin.

```sh
deno add jsr:@mage/tailwindcss npm:tailwindcss
```

Apply the plugin to your Mage app.

```tsx
import { MageApp } from "@mage/app";
import { tailwindcss } from "@mage/tailwindcss";

export const app = new MageApp();

app.plugin(
  tailwindcss({
    entry: "./src/main.css",
    output: "./public/main.css",
  }),
);
```

### Watch mode

When running `app.develop()` the plugin will compile your CSS automatically on
changes.

### Building for production

When running `app.build()` the plugin will compile your CSS once and optimise it
for production.
