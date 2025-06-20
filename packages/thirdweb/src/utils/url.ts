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
export function formatUniversalUrl(
  appUrl: string,
  wcUri: string,
): LinkingRecord {
  if (!isHttpUrl(appUrl)) {
    return formatNativeUrl(appUrl, wcUri);
  }
  let safeAppUrl = appUrl;
  if (!safeAppUrl.endsWith("/")) {
    safeAppUrl = `${safeAppUrl}/`;
  }
  const encodedWcUrl = encodeURIComponent(wcUri);

  return {
    href: safeAppUrl,
    redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
  };
}

/**
 * @internal
 */
export function formatNativeUrl(appUrl: string, wcUri: string): LinkingRecord {
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
    href: safeAppUrl,
    redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
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

export function formatExplorerTxUrl(explorerUrl: string, txHash: string) {
  return `${explorerUrl.endsWith("/") ? explorerUrl : `${explorerUrl}/`}tx/${txHash}`;
}

export function formatExplorerAddressUrl(explorerUrl: string, address: string) {
  return `${explorerUrl.endsWith("/") ? explorerUrl : `${explorerUrl}/`}address/${address}`;
}
