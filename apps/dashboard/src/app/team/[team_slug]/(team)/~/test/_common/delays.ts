// This adds a key difference from the client side version -
// client side version can skip this entirely on subsequent date range changes
export async function simulatePageProcessingDelay() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

export async function simulateChartFetchingDelay() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
}
