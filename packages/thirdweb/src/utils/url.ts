/**
 * @internal
 */
export function isHttpUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

type LinkingRecord = {
  redirect: string;
  href: string;
};

/**
 * @internal
 */
function formatUniversalUrl(appUrl: string, wcUri: string): LinkingRecord {
  if (!isHttpUrl(appUrl)) {
    return formatNativeUrl(appUrl, wcUri);
  }
  let safeAppUrl = appUrl;
  if (!safeAppUrl.endsWith("/")) {
    safeAppUrl = `${safeAppUrl}/`;
  }
  const encodedWcUrl = encodeURIComponent(wcUri);

  return {
    redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
    href: safeAppUrl,
  };
}

/**
 * @internal
 */
function formatNativeUrl(appUrl: string, wcUri: string): LinkingRecord {
  if (isHttpUrl(appUrl)) {
    return formatUniversalUrl(appUrl, wcUri);
  }
  let safeAppUrl = appUrl;
  if (!safeAppUrl.includes("://")) {
    safeAppUrl = appUrl.replaceAll("/", "").replaceAll(":", "");
    safeAppUrl = `${safeAppUrl}://`;
  }
  if (!safeAppUrl.endsWith("/")) {
    safeAppUrl = `${safeAppUrl}/`;
  }
  const encodedWcUrl = encodeURIComponent(wcUri);

  return {
    redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
    href: safeAppUrl,
  };
}

/**
 * @internal
 */
export function formatWalletConnectUrl(
  appUrl: string,
  wcUri: string,
): LinkingRecord {
  return isHttpUrl(appUrl)
    ? formatUniversalUrl(appUrl, wcUri)
    : formatNativeUrl(appUrl, wcUri);
}
