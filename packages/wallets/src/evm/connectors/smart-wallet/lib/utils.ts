import { ethers } from "ethers";
import { UserOperationStruct } from "@account-abstraction/contracts";
import { readFileSync, writeFileSync } from "fs";

export function toJSON(op: Partial<UserOperationStruct>): Promise<any> {
  return ethers.utils.resolveProperties(op).then((userOp) =>
    Object.keys(userOp)
      .map((key) => {
        let val = (userOp as any)[key];
        if (typeof val !== "string" || !val.startsWith("0x")) {
          val = ethers.utils.hexValue(val);
        }
        return [key, val];
      })
      .reduce(
        (set, [k, v]) => ({
          ...set,
          [k]: v,
        }),
        {}
      )
  );
}

export async function printOp(
  op: Partial<UserOperationStruct>
): Promise<string> {
  return toJSON(op).then((userOp) => JSON.stringify(userOp, null, 2));
}

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
