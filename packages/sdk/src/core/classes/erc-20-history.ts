import { fetchCurrencyValue } from "../../common/currency";
import { TokenHolderBalance } from "../../types";
import { ContractEvents } from "./contract-events";
import { ContractWrapper } from "./contract-wrapper";
import type { TokenERC20 } from "@thirdweb-dev/contracts-js";
import { BigNumber, constants } from "ethers";

/**
 * Manages history for Token contracts
 * @public
 */
export class TokenERC20History {
  private events;
  private contractWrapper;

  constructor(
    contractWrapper: ContractWrapper<TokenERC20>,
    events: ContractEvents<TokenERC20>,
  ) {
    this.contractWrapper = contractWrapper;
    this.events = events;
  }

  /**
   * Get all holder balances
   *
   * @remarks Lets you get all token holders and their corresponding balances
   * @returns - A JSON object of all token holders and their corresponding balances
   * @example
   * ```javascript
   * const allHolderBalances = await contract.history.getAllHolderBalances();
   * ```
   */
  public async getAllHolderBalances(): Promise<TokenHolderBalance[]> {
    const a = await this.events.getEvents("Transfer");
    const txns: Record<string, any>[] = a.map((b) => b.data);
    const balances: {
      [key: string]: BigNumber;
    } = {};
    txns.forEach((item) => {
      const from = item?.from;
      const to = item?.to;
      const amount = item?.value;

      if (!(from === constants.AddressZero)) {
        if (!(from in balances)) {
          balances[from] = BigNumber.from(0);
        }
        balances[from] = balances[from].sub(amount);
      }
      if (!(to === constants.AddressZero)) {
        if (!(to in balances)) {
          balances[to] = BigNumber.from(0);
        }
        balances[to] = balances[to].add(amount);
      }
    });
    return Promise.all(
      Object.keys(balances).map(async (addr) => ({
        holder: addr,
        balance: await fetchCurrencyValue(
          this.contractWrapper.getProvider(),
          this.contractWrapper.readContract.address,
          balances[addr],
        ),
      })),
    );
  }
}
