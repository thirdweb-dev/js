import { UserWallet } from "../classes/user-wallet";
import { Metaplex, Pda } from "@metaplex-foundation/js";
import {
  Program as AnchorProgram,
  Idl,
  AnchorProvider,
} from "@project-serum/anchor";
import { PublicKey, Signer } from "@solana/web3.js";

export class Program {
  private program: AnchorProgram<Idl>;

  constructor(programAddress: string, idl: Idl, provider: AnchorProvider) {
    this.program = new AnchorProgram(idl, programAddress, provider);
    // console.log(this.program.account);
    const pda = Pda.find(new PublicKey(programAddress), [
      Buffer.from("default"),
    ]);
    console.log("pda", pda.toBase58());
    PublicKey.findProgramAddress;
  }

  async call(
    functionName: string,
    args: {
      accounts: Record<string, string>;
      data?: any[];
      signers?: Signer[];
    },
  ) {
    const fn = this.program.methods[functionName];
    if (!fn) {
      throw new Error(`Function ${functionName} not found`);
    }
    const fnWithArgs = args.data ? fn(...args.data) : fn();
    return await fnWithArgs
      .accounts(args.accounts)
      .signers(args.signers || [])
      .rpc();
  }

  async fetch(accountName: string, address: string) {
    const account = this.program.account[accountName];
    if (!account) {
      throw new Error(`Account ${account} not found`);
    }
    return await account.fetch(address);
  }
}
