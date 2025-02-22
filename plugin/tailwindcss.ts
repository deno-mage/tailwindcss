import { resolve } from "@std/path";
import type { MagePlugin } from "@mage/app";
import { MageLogger } from "@mage/app/logs";

/**
 * Options for using Tailwindcss plugin
 */
interface TailwindCSSPluginOptions {
  /**
   * Path to the entry CSS file
   */
  entry: string;
  /**
   * Path to the output CSS file
   */
  output: string;
}

/**
 * Compile CSS using Tailwindcss
 */
class Tailwindcss implements MagePlugin {
  private _logger = new MageLogger(this.name);
  private _entry: string;
  private _output: string;

  /**
   * Create a new Tailwindcss plugin
   *
   * @param options Tailwindcss plugin options
   */
  constructor(options: TailwindCSSPluginOptions) {
    this._entry = resolve(options.entry);
    this._output = resolve(options.output);
  }

  public get name() {
    return "TailwindcssPlugin";
  }

  /**
   * Build the CSS file using Tailwindcss CLI
   */
  public onBuild = async () => {
    await this.spawnTailwindcss(false);
  };

  /**
   * Watch for changes in the CSS file and other files and
   * rebuild it using Tailwindcss CLI
   */
  public onDevelop = async () => {
    await this.spawnTailwindcss(true);
  };

  /**
   * Build CSS file using Tailwindcss CLI
   *
   * @param watch Watch for changes in the CSS file
   */
  private async spawnTailwindcss(watch: boolean) {
    const command = new Deno.Command("deno", {
      args: [
        "run",
        "-A",
        "npm:@tailwindcss/cli",
        "-i",
        this._entry,
        "-o",
        this._output,
        watch ? "--watch" : "",
      ],
      stdout: "piped",
      stderr: "piped",
    });

    const child = command.spawn();
    const decoder = new TextDecoder();

    // Read and log stderr
    (async () => {
      for await (const chunk of child.stderr) {
        const lines = decoder.decode(chunk).split("\n");
        lines.forEach((line) => {
          this._logger.info(line);
        });
      }
    })();

    const status = await child.status;
    await child.stdout.cancel();
    await child.stderr.cancel();

    if (!status.success) {
      this._logger.error(`Plugin exited with error ${status.code}`);
    }
  }
}

/**
 * Create a new Tailwindcss plugin
 * @param options Tailwindcss plugin options
 * @returns Tailwindcss plugin
 */
export const tailwindcss = (options: TailwindCSSPluginOptions): MagePlugin => {
  return new Tailwindcss(options);
};
