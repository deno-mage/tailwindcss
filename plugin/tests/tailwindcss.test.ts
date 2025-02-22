import { beforeEach, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { tailwindcss } from "../mod.ts";
import { resolve } from "@std/path";
import { retry } from "../../test-utils/retry.ts";
import { MageApp } from "@mage/app";
import { exists } from "@std/fs";

const entryFile = "plugin/tests/fixtures/entry.css";
const entryContent = `@import "tailwindcss";

.page-title {
  @apply text-4xl font-bold;
}`;

const outputFile = "plugin/tests/fixtures/output.css";
const developOutputContent = `.page-title {
  font-size: var(--text-4xl);
  line-height: var(--tw-leading, var(--text-4xl--line-height));
  --tw-font-weight: var(--font-weight-bold);
  font-weight: var(--font-weight-bold);
}`;
const buildOutputContent =
  `.page-title{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height));`;

beforeEach(async () => {
  if (await exists(entryFile)) {
    await Deno.remove(entryFile);
  }

  if (await exists(outputFile)) {
    await Deno.remove(outputFile);
  }

  await Deno.writeTextFile(
    entryFile,
    entryContent,
  );
});

describe("tailwindcss", () => {
  it("should build css file", async () => {
    const app = new MageApp();
    app.plugin(tailwindcss({
      entry: resolve(entryFile),
      output: resolve(outputFile),
    }));
    await app.build();

    const output = await Deno.readTextFile(outputFile);
    expect(output).toContain(buildOutputContent);
  });

  // Can't run this test in CI as "watchman" won't install
  if (Deno.env.get("CI") !== "true") {
    it("should watch for changes in css file", async () => {
      const command = new Deno.Command("deno", {
        args: ["run", "-A", "plugin/tests/fixtures/develop.ts"],
      });

      const child = command.spawn();

      await retry(async () => {
        const output = await Deno.readTextFile(outputFile);

        expect(output).toContain(developOutputContent);
      });

      child.kill();

      await child.status;
    });
  }
});
