import { getDefaultProvider } from "ethers";
import { getExistingUserEtherJsWallet } from "./helpers/wallet/retrieval";

export async function getEthersSigner(clientId: string) {
  const wallet = await getExistingUserEtherJsWallet(clientId);
  // console.log('getEthersSigner: wallet');
  const newWallet = wallet.connect(getDefaultProvider());

  // console.log('getEthersSigner: getChainId');
  await newWallet.getChainId();
  // console.log('getEthersSigner: chainId', chainId);
  return newWallet;
}
