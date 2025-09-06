import type { ThirdwebClient } from "../../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../../utils/domains.js";
import { stringify } from "../../../../../utils/json.js";
import { getLoginCallbackUrl } from "../../../core/authentication/getLoginPath.js";
import type {
  AuthStoredTokenWithCookieReturnType,
  MultiStepAuthArgsType,
  PreAuthArgsType,
} from "../../../core/authentication/types.js";
import type { Ecosystem } from "../../../core/wallet/types.js";

/**
 * @internal
 */
export const sendOtp = async (args: PreAuthArgsType): Promise<void> => {
  const { client, ecosystem } = args;
  const url = `${getThirdwebBaseUrl("api")}/v1/auth/initiate`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-client-id": client.clientId,
  };

  if (ecosystem?.id) {
    headers["x-ecosystem-id"] = ecosystem.id;
  }

  if (ecosystem?.partnerId) {
    headers["x-ecosystem-partner-id"] = ecosystem.partnerId;
  }

  const body = (() => {
    switch (args.strategy) {
      case "email":
        return {
          method: "email",
          email: args.email,
        };
      case "phone":
        return {
          method: "sms",
          phone: args.phoneNumber,
        };
    }
  })();

  const response = await fetch(url, {
    body: stringify(body),
    headers,
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to send verification code");
  }

  return;
};

/**
 * @internal
 */
export const verifyOtp = async (
  args: MultiStepAuthArgsType & {
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
  },
): Promise<AuthStoredTokenWithCookieReturnType> => {
  const { client, ecosystem } = args;
  const url = getLoginCallbackUrl({
    authOption: args.strategy,
    client: args.client,
    ecosystem: args.ecosystem,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-client-id": client.clientId,
  };

  if (ecosystem?.id) {
    headers["x-ecosystem-id"] = ecosystem.id;
  }

  if (ecosystem?.partnerId) {
    headers["x-ecosystem-partner-id"] = ecosystem.partnerId;
  }

  const body = (() => {
    switch (args.strategy) {
      case "email":
        return {
          code: args.verificationCode,
          email: args.email,
        };
      case "phone":
        return {
          code: args.verificationCode,
          phone: args.phoneNumber,
        };
    }
  })();

  const response = await fetch(url, {
    body: stringify(body),
    headers,
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to verify verification code");
  }

  return await response.json();
};
