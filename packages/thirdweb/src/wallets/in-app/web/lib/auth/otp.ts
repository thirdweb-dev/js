import type { ThirdwebClient } from "../../../../../client/client.js";
import { stringify } from "../../../../../utils/json.js";
import {
  getLoginCallbackUrl,
  getLoginUrl,
} from "../../../core/authentication/getLoginPath.js";
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
  const url = getLoginUrl({ client, ecosystem, authOption: args.strategy });

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
          email: args.email,
        };
      case "phone":
        return {
          phone: args.phoneNumber,
        };
    }
  })();

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to send verification code");
  }

  return await response.json();
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
          email: args.email,
          code: args.verificationCode,
        };
      case "phone":
        return {
          phone: args.phoneNumber,
          code: args.verificationCode,
        };
    }
  })();

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to verify verification code");
  }

  return await response.json();
};
