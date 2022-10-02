import { UserWallet } from "../classes/user-wallet";
import { Cluster, resolveClusterFromConnection } from "@metaplex-foundation/js";
import {
  Program as AnchorProgram,
  Idl,
  AnchorProvider,
  setProvider,
} from "@project-serum/anchor";
import { Connection, PublicKey, Signer } from "@solana/web3.js";

/**
 * Dynamic interface for interacting with Solana programs.
 *
 * @example
 * ```jsx
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
 *
 * const sdk = ThirdwebSDK.fromNetwork("devnet");
 * sdk.wallet.connect(signer);
 *
 * // Get the interface for your program
 * const program = await sdk.getProgram("{{contract_address}}");
 * ```
 *
 * @public
 */
export class Program {
  private program: AnchorProgram<Idl>;
  public publicKey: PublicKey;
  public accountType = "program" as const;
  public network: Cluster;

  constructor(
    programAddress: string,
    idl: Idl,
    connection: Connection,
    wallet: UserWallet,
  ) {
    this.publicKey = new PublicKey(programAddress);
    this.network = resolveClusterFromConnection(connection);
    setProvider(new AnchorProvider(connection, wallet.getSigner(), {}));
    this.program = new AnchorProgram(idl, programAddress);
    wallet.events.on("connected", () => {
      setProvider(new AnchorProvider(connection, wallet.getSigner(), {}));
    });
    wallet.events.on("disconnected", () => {
      // identity will be guest in this case
      setProvider(new AnchorProvider(connection, wallet.getSigner(), {}));
    });
  }

  /**
   * Call a function on this program
   * @param functionName - Name of the function to call
   * @param args - Arguments to pass to the function including accounts, data, and signers
   * @returns result of the contract call
   *
   * @example
   * ```jsx
   * const counterAccount = Keypair.generate();
   * await program.call("increment", {
   *   // We need to pass in the public keys of any accounts to interact with
   *   accounts: {
   *     counterAccount: counterAccount.publicKey.toBase58(),
   *   },
   *   // As well as the arguments to pass to the data parameters
   *   data: ["..."],
   *   // And the signer of the account that will be signing the message
   *   signers: [counterAccount]
   * })
   * ```
   */
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

  /**
   * Read account data associated with this program
   * @param accountName - The name of the account type to fetch the data of
   * @param address - The address of the specific account to fetch
   * @returns - The data of the requested account
   *
   * @example
   * ```jsx
   * const accountAddress = "...";
   * // Get the counterAccount at specified address
   * const counterAccount = await program.fetch("counterAccount", accountaddress);
   * ```
   */
  async fetch(accountName: string, address: string) {
    const account = this.program.account[accountName];
    if (!account) {
      throw new Error(`Account ${account} not found`);
    }
    return await account.fetch(address);
  }
}
