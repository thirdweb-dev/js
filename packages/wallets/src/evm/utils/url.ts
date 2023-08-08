export function isTwUrl(url: string): boolean {
  const host = new URL(url).hostname;
  return (
    host.endsWith(".thirdweb.com") || host === "localhost" || host === "0.0.0.0"
  );
}
