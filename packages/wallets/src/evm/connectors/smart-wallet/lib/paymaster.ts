import { PaymasterAPI } from "@account-abstraction/sdk";
import { UserOperationStruct } from "@account-abstraction/contracts";
import { toJSON } from "./utils";
import fetch from "cross-fetch";

export const SIG_SIZE = 65;
export const DUMMY_PAYMASTER_AND_DATA =
  "0x0101010101010101010101010101010101010101000000000000000000000000000000000000000000000000000001010101010100000000000000000000000000000000000000000000000000000000000000000101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101";

class VerifyingPaymasterAPI extends PaymasterAPI {
  private paymasterUrl: string;
  private entryPoint: string;
  private apiKey: string;
  constructor(paymasterUrl: string, entryPoint: string, apiKey: string) {
    super();
    this.paymasterUrl = paymasterUrl;
    this.entryPoint = entryPoint;
    this.apiKey = apiKey;
  }

  async getPaymasterAndData(
    userOp: Partial<UserOperationStruct>,
  ): Promise<string> {
    // Ask the paymaster to sign the transaction and return a valid paymasterAndData value.
    const response = await fetch(this.paymasterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
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
  apiKey: string,
) => new VerifyingPaymasterAPI(paymasterUrl, entryPoint, apiKey);
