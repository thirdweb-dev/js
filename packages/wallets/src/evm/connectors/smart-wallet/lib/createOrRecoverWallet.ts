import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "fs";

// This is not used - do we need it?
export async function createOrRecoverWallet(): Promise<ethers.Wallet> {
  let wallet: ethers.Wallet;
  try {
    const _mnemonic = readFileSync("wallet.json", "utf8");
    if (_mnemonic) {
      wallet = ethers.Wallet.fromMnemonic(_mnemonic);
    } else {
      wallet = ethers.Wallet.createRandom();
      writeFileSync("wallet.json", wallet._mnemonic().phrase);
    }
  } catch (e) {
    console.log("Error: ", e);
    wallet = ethers.Wallet.createRandom();
    writeFileSync("wallet.json", wallet._mnemonic().phrase);
  }
  return wallet;
}
