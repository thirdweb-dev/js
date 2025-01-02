import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { type AuthOption, authOptions } from "../../../../wallets/types.js";
import type { Ecosystem } from "../wallet/types.js";

const getLoginOptionRoute = (option: AuthOption) => {
  if (!authOptions.includes(option as AuthOption)) {
    throw new Error(`Unknown auth option ${option}`);
  }
  switch (option) {
    case "wallet":
      return "siwe";
    default:
      return option;
  }
};

export const getLoginUrl = ({
  authOption,
  client,
  ecosystem,
  mode = "popup",
  redirectUrl,
}: {
  authOption: AuthOption;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  mode?: "popup" | "redirect" | "window";
  redirectUrl?: string;
}) => {
  if (mode === "popup" && redirectUrl) {
    throw new Error("Redirect URL is not supported for popup mode");
  }

  if (mode === "window" && !redirectUrl) {
    throw new Error("Redirect URL is required for window mode");
  }

  const route = getLoginOptionRoute(authOption);
  let baseUrl = `${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/login/${route}?clientId=${client.clientId}`;
  if (ecosystem?.partnerId) {
    baseUrl = `${baseUrl}&ecosystemId=${ecosystem.id}&ecosystemPartnerId=${ecosystem.partnerId}`;
  } else if (ecosystem) {
    baseUrl = `${baseUrl}&ecosystemId=${ecosystem.id}`;
  }

  // Always append redirectUrl to the baseUrl if mode is not popup
  if (mode !== "popup") {
    const formattedRedirectUrl = new URL(redirectUrl || window.location.href);
    formattedRedirectUrl.searchParams.set("walletId", ecosystem?.id || "inApp");
    formattedRedirectUrl.searchParams.set("authProvider", authOption);
    baseUrl = `${baseUrl}&redirectUrl=${encodeURIComponent(formattedRedirectUrl.toString())}`;
  }

  return baseUrl;
};

export const getLoginCallbackUrl = ({
  authOption,
  client,
  ecosystem,
}: {
  authOption: AuthOption;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
}): string => {
  const route = getLoginOptionRoute(authOption);
  let baseUrl = `${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/login/${route}/callback?clientId=${client.clientId}`;
  if (ecosystem?.partnerId) {
    baseUrl = `${baseUrl}&ecosystemId=${ecosystem.id}&ecosystemPartnerId=${ecosystem.partnerId}`;
  } else if (ecosystem) {
    baseUrl = `${baseUrl}&ecosystemId=${ecosystem.id}`;
  }

  return baseUrl;
};
