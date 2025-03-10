export function pollWithTimeout(params: {
  shouldStop: () => Promise<boolean>;
  timeoutMs: number;
}): Promise<void> {
  const { shouldStop: shouldStopPolling, timeoutMs } = params;

  return new Promise<void>((resolve) => {
    let isPromiseResolved = false;

    const timeoutPromise = new Promise<void>((timeoutResolve) => {
      setTimeout(() => {
        timeoutResolve();
      }, timeoutMs);
    });

    const poll = async () => {
      if (isPromiseResolved) {
        return;
      }

      if (await shouldStopPolling().catch(() => false)) {
        return;
      } else {
        // Add a small delay before next poll to ensure we're not in a infinite loop if `isTrue` resolves in very short time
        await new Promise((r) => setTimeout(r, 100));
        await poll();
      }
    };

    // resolve the promise if the condition is met or the timeout is reached
    Promise.race([poll(), timeoutPromise]).then(() => {
      resolve();
      isPromiseResolved = true;
    });
  });
}
