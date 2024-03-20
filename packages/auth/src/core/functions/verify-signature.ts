import { checkContractWalletSignature } from "@thirdweb-dev/wallets";
import { utils } from "ethers";

export async function verifySignature(
  message: string,
  signature: string,
  address: string,
  chainId?: number,
  clientId?: string,
  secretKey?: string,
): Promise<boolean> {
  try {
    const messageHash = utils.hashMessage(message);
    const messageHashBytes = utils.arrayify(messageHash);
    const recoveredAddress = utils.recoverAddress(messageHashBytes, signature);

    if (recoveredAddress === address) {
      return true;
    }
  } catch {
    // no-op
  }

  if (!chainId) {
    return false;
  }
  return checkContractWalletSignature(
    message,
    signature,
    address,
    chainId,
    clientId,
    secretKey,
  );
}
