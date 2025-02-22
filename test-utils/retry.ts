/**
 * The options for the retry function
 */
interface RetryOptions {
  /**
   * The time to wait between retries
   */
  waits?: number[];
  /**
   * The timeout for the each retry
   */
  timeout?: number;
}

/**
 * Retries a function until it succeeds or the timeout is reached. The timeout is per attempt.
 *
 * @param fn The function to retry
 * @param options The options for the retry
 */
export const retry = async (
  fn: () => Promise<void>,
  options?: RetryOptions,
) => {
  const waits = options?.waits ?? [1000, 3000, 5000];

  for (let i = 0; i < waits.length; i++) {
    try {
      if (options?.timeout) {
        await Promise.race([
          fn(),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Operation timed out")),
              options.timeout,
            )
          ),
        ]);
      } else {
        await fn();
      }
      break;
    } catch (e) {
      if (i === waits.length - 1) {
        throw e;
      }
      await new Promise((resolve) => setTimeout(resolve, waits[i]));
    }
  }
};
