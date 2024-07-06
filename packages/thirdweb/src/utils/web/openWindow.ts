/**
 * @internal
 */
export function openWindow(uri: string) {
  const isInsideIframe = window !== window.top;
  if (isInsideIframe) {
    window.open(uri);
  } else {
    if (uri.startsWith("http")) {
      // taken from for https://github.com/rainbow-me/rainbowkit/

      // Using 'window.open' causes issues on iOS in non-Safari browsers and
      // WebViews where a blank tab is left behind after connecting.
      // This is especially bad in some WebView scenarios (e.g. following a
      // link from Twitter) where the user doesn't have any mechanism for
      // closing the blank tab.
      // For whatever reason, links with a target of "_blank" don't suffer
      // from this problem, and programmatically clicking a detached link
      // element with the same attributes also avoids the issue.

      const link = document.createElement("a");
      link.href = uri;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      link.click();
    } else {
      window.location.href = uri;
    }
  }
}
