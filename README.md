<p align="center" style="color: #343a40">
  <img src="https://raw.githubusercontent.com/deno-mage/server/main/mage.png" alt="Emotion logo" height="150" width="150">
  <h1 align="center">Mage</h1>
</p>
<div align="center">
  Build web applications with <a href="https://deno.com">Deno</a>
</div>

## Mage Tailwindcss

TailwindCSS plugin for Mage.

### Getting started

```sh
deno add jsr:@mage/tailwindcss
```

An example app:

```tsx
// app.ts
import { resolve } from "@std/path";
import { MageApp } from "@mage/app";
import { useServeFiles } from "@mage/app/serve-files";
import { tailwindcss } from "@mage/tailwindcss";

export const app = new MageApp();

app.plugin(
  tailwindcss({
    entry: "./example/src/main.css",
    output: "./example/public/main.css",
    configFilepath: "./example/tailwind.config.ts",
  })
);

app.get("/", (c) => {
  c.html(`<link rel="stylesheet" href="/public/main.css">
    <h1 class="page-title">Hello, world!!!</h1>`);
});

app.get(
  "/public/*",
  useServeFiles({
    directory: resolve(Deno.cwd(), "example/public"),
  })
);

// build.ts
import { app } from "./app.ts";

app.build();

// develop.ts
import { app } from "./app.ts";

app.develop();

Deno.serve(app.handler);

// serve.ts
import { app } from "./app.ts";

Deno.serve(app.handler);
```

To build and run in production:

```sh
# build assets first
deno run -A build.ts

# run the server
deno run -A serve.ts
```

To run in development mode:

```sh
deno run -A develop.ts
```
