import { BigNumberish, Event, providers, utils } from "ethers";
import { EntryPoint } from "@account-abstraction/contracts";

/**
 * This class encapsulates Ethers.js listener function and necessary UserOperation details to
 * discover a TransactionReceipt for the operation.
 *
 * TODO refactor this to a simple event listener on the entry point
 */
export class UserOperationEventListener {
  resolved = false;
  boundLisener: (this: any, ...param: any) => void;

  constructor(
    readonly resolve: (t: providers.TransactionReceipt) => void,
    readonly reject: (reason?: any) => void,
    readonly entryPoint: EntryPoint,
    readonly sender: string,
    readonly userOpHash: string,
    readonly nonce?: BigNumberish,
    readonly timeout?: number,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.boundLisener = this.listenerCallback.bind(this);
  }

  start(): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const filter = this.entryPoint.filters.UserOperationEvent(this.userOpHash);
    // listener takes time... first query directly:
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      const res = await this.entryPoint.queryFilter(filter, -10); // look at last 10 blocks
      if (res.length > 0) {
        void this.listenerCallback(res[0]);
      } else {
        this.entryPoint.once(filter, this.boundLisener);
      }
    }, 100);
  }

  stop(): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.entryPoint.off("UserOperationEvent", this.boundLisener);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async listenerCallback(this: any, ...param: any): Promise<void> {
    // TODO clean this up..
    // eslint-disable-next-line prefer-rest-params
    const event = arguments[arguments.length - 1] as Event;
    if (!event.args) {
      console.error("got event without args", event);
      return;
    }
    // TODO: can this happen? we register to event by userOpHash..
    if (event.args.userOpHash !== this.userOpHash) {
      console.log(
        `== event with wrong userOpHash: sender/nonce: event.${
          event.args.sender as string
        }@${event.args.nonce.toString() as string}!= userOp.${
          this.sender as string
        }@${parseInt(this.nonce?.toString())}`,
      );
      return;
    }

    const transactionReceipt = await event.getTransactionReceipt();

    // before returning the receipt, update the status from the event.
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!event.args.success) {
      await this.extractFailureReason(transactionReceipt);
    }
    this.stop();
    this.resolve(transactionReceipt);
    this.resolved = true;
  }

  async extractFailureReason(
    receipt: providers.TransactionReceipt,
  ): Promise<void> {
    receipt.status = 0;
    const revertReasonEvents = await this.entryPoint.queryFilter(
      this.entryPoint.filters.UserOperationRevertReason(
        this.userOpHash,
        this.sender,
      ),
      receipt.blockHash,
    );
    if (revertReasonEvents[0]) {
      let message = revertReasonEvents[0].args.revertReason;
      if (message.startsWith("0x08c379a0")) {
        // Error(string)
        message = utils.defaultAbiCoder
          .decode(["string"], "0x" + message.substring(10))
          .toString();
      }
      this.reject(new Error(`UserOp failed with reason: ${message}`));
    }
  }
}
