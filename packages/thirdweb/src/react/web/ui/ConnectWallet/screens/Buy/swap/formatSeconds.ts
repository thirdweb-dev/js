/**
 * @internal
 */
export function formatSeconds(seconds: number) {
  // hours and minutes
  if (seconds > 3600) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} Hours ${minutes} Minutes`;
  }

  // minutes only
  if (seconds > 60) {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} Minutes`;
  }

  return `${seconds}s`;
}
