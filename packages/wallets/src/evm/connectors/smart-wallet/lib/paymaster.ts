import { PaymasterAPI } from "@account-abstraction/sdk";
import { UserOperationStruct } from "@account-abstraction/contracts";
import { toJSON } from "./utils";
import fetch from "cross-fetch";
import { isTwUrl } from "../../../utils/url";

export const SIG_SIZE = 65;
export const DUMMY_PAYMASTER_AND_DATA =
  "0x0101010101010101010101010101010101010101000000000000000000000000000000000000000000000000000001010101010100000000000000000000000000000000000000000000000000000000000000000101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101";

class VerifyingPaymasterAPI extends PaymasterAPI {
  private paymasterUrl: string;
  private entryPoint: string;
  private clientId?: string;
  private secretKey?: string;
  private authToken?: string | null;
  constructor(
    paymasterUrl: string,
    entryPoint: string,
    clientId?: string,
    secretKey?: string,
  ) {
    super();
    this.paymasterUrl = paymasterUrl;
    this.entryPoint = entryPoint;
    this.clientId = clientId;
    this.secretKey = secretKey;
    this.authToken = null;
    const authTokenExists = typeof globalThis !== "undefined" && "AUTH_TOKEN" in globalThis;
    if (authTokenExists) {
      // @ts-ignore
      this.authToken = globalThis.AUTH_TOKEN;
    }
  }

  async getPaymasterAndData(
    userOp: Partial<UserOperationStruct>,
  ): Promise<string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (isTwUrl(this.paymasterUrl)) {
      if (this.secretKey && this.clientId) {
        throw new Error(
          "Cannot use both secret key and client ID. Please use secretKey for server-side applications and clientId for client-side applications.",
        );
      }

      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`;
      }

      if (this.secretKey) {
        headers["x-secret-key"] = this.secretKey;
      } else if (this.clientId) {
        headers["x-client-id"] = this.clientId;

        if (
          typeof globalThis !== "undefined" &&
          "APP_BUNDLE_ID" in globalThis
        ) {
          headers["x-bundle-id"] = (globalThis as any).APP_BUNDLE_ID as string;
        }
      }
    }

    // Ask the paymaster to sign the transaction and return a valid paymasterAndData value.
    const response = await fetch(this.paymasterUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "pm_sponsorUserOperation",
        params: [await toJSON(userOp), { entryPoint: this.entryPoint }],
      }),
    });
    const res = await response.json();

    if (!response.ok) {
      const error = res.error || response.statusText;
      const code = res.code || "UNKNOWN";

      throw new Error(
        `Paymaster error: ${error}
Status: ${response.status}
Code: ${code}`,
      );
    }

    if (res.result) {
      const result = (res.result as any).paymasterAndData || res.result;
      return result.toString();
    } else {
      throw new Error(`Paymaster returned no result from ${this.paymasterUrl}`);
    }
  }
}

export const getVerifyingPaymaster = (
  paymasterUrl: string,
  entryPoint: string,
  clientId?: string,
  secretKey?: string,
) => new VerifyingPaymasterAPI(paymasterUrl, entryPoint, clientId, secretKey);
