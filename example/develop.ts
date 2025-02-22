import { app } from "./src/app.ts";

app.develop();

Deno.serve(app.handler);
