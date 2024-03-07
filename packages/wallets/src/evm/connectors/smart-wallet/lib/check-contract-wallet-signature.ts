import { Contract, providers, utils } from "ethers";
import { setAnalyticsHeaders } from "../../../utils/headers";
import { isTwUrl } from "../../../utils/url";
import { chainIdToThirdwebRpc } from "../../../wallets/abstract";

const EIP1271_ABI = [
  "function isValidSignature(bytes32 _hash, bytes _signature) public view returns (bytes4)",
];
const EIP1271_MAGICVALUE = "0x1626ba7e";

export async function checkContractWalletSignature(
  message: string,
  signature: string,
  address: string,
  chainId: number,
  clientId?: string,
  secretKey?: string,
): Promise<boolean> {
  // TODO: remove below `skipFetchSetup` logic when ethers.js v6 support arrives
  let _skipFetchSetup = false;
  if (
    typeof globalThis !== "undefined" &&
    "TW_SKIP_FETCH_SETUP" in globalThis &&
    typeof (globalThis as any).TW_SKIP_FETCH_SETUP === "boolean"
  ) {
    _skipFetchSetup = (globalThis as any).TW_SKIP_FETCH_SETUP as boolean;
  }

  const rpcUrl = chainIdToThirdwebRpc(chainId, clientId);

  const headers: Record<string, string> = {};

  if (isTwUrl(rpcUrl)) {
    const bundleId =
      typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis
        ? ((globalThis as any).APP_BUNDLE_ID as string)
        : undefined;

    if (secretKey) {
      headers["x-secret-key"] = secretKey;
    } else if (clientId) {
      headers["x-client-id"] = clientId;

      if (bundleId) {
        headers["x-bundle-id"] = bundleId;
      }
    }

    // Dashboard token
    if (
      typeof globalThis !== "undefined" &&
      "TW_AUTH_TOKEN" in globalThis &&
      typeof (globalThis as any).TW_AUTH_TOKEN === "string"
    ) {
      headers["authorization"] = `Bearer ${
        (globalThis as any).TW_AUTH_TOKEN as string
      }`;
    }

    // CLI token
    if (
      typeof globalThis !== "undefined" &&
      "TW_CLI_AUTH_TOKEN" in globalThis &&
      typeof (globalThis as any).TW_CLI_AUTH_TOKEN === "string"
    ) {
      headers["authorization"] = `Bearer ${
        (globalThis as any).TW_CLI_AUTH_TOKEN as string
      }`;
      headers["x-authorize-wallet"] = "true";
    }

    setAnalyticsHeaders(headers);
  }

  const provider = new providers.StaticJsonRpcProvider(
    {
      url: chainIdToThirdwebRpc(chainId),
      skipFetchSetup: _skipFetchSetup,
      headers,
    },
    chainId,
  );
  const walletContract = new Contract(address, EIP1271_ABI, provider);
  try {
    const res = await walletContract.isValidSignature(
      utils.hashMessage(message),
      signature,
    );
    return res === EIP1271_MAGICVALUE;
  } catch {
    return false;
  }
}
