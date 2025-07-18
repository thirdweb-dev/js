const MIN_TICK = -887200;
const MAX_TICK = 887200;
const TICK_SPACING = 200;

export function getInitialTickValue(params: { startingPricePerToken: number }) {
  const calculatedTick =
    Math.log(params.startingPricePerToken) / Math.log(1.0001);

  // Round to nearest tick spacing
  const tick = Math.round(calculatedTick / TICK_SPACING) * TICK_SPACING;

  return tick;
}

export function isValidTickValue(tick: number) {
  return tick >= MIN_TICK && tick <= MAX_TICK;
}
