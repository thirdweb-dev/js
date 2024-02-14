import { decodeAbiParameters } from "viem";
import type { Chain } from "../../../chain/index.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { getEvents, prepareEvent } from "../../../event/index.js";
import {
  ENTRYPOINT_ADDRESS,
  USER_OP_EVENT_ABI,
  USER_OP_REVERT_REASON_EVENT_ABI,
} from "./constants.js";

/**
 * @internal
 */
export async function getUserOpEventFromEntrypoint(args: {
  blockNumber: bigint;
  blockRange: bigint;
  client: ThirdwebClient;
  chain: Chain;
  userOpHash: string;
}) {
  const { blockNumber, blockRange, chain, userOpHash, client } = args;
  console.log("getUserOpEventFromEntrypoint", blockNumber, blockRange);
  const fromBlock =
    blockNumber > blockRange ? blockNumber - blockRange : blockNumber;
  const entryPointContract = getContract({
    address: ENTRYPOINT_ADDRESS,
    chain: chain,
    client: client,
  });
  const userOpEvent = prepareEvent({
    contract: entryPointContract,
    event: USER_OP_EVENT_ABI,
  });
  const events = await getEvents({
    contract: entryPointContract,
    events: [userOpEvent],
    fromBlock,
  });
  // FIXME typing
  const event = events.find((e) => (e.args as any).userOpHash === userOpHash);
  // UserOp can revert, so we need to surface revert reason
  if ((event?.args as any)?.success === false) {
    const revertOpEvent = prepareEvent({
      contract: entryPointContract,
      event: USER_OP_REVERT_REASON_EVENT_ABI,
    });
    const revertEvent = await getEvents({
      contract: entryPointContract,
      events: [revertOpEvent],
      fromBlock: event?.blockNumber,
      toBlock: event?.blockNumber,
    });
    if (revertEvent && revertEvent.length > 0) {
      let message: string = (revertEvent[0]?.args as any)?.revertReason;
      if (message.startsWith("0x08c379a0")) {
        message = decodeAbiParameters(
          [{ type: "string" }],
          `0x${message.substring(10)}`,
        )[0];
      }
      throw new Error(`UserOp failed with reason: ${message}`);
    } else {
      throw new Error("UserOp failed with unknown reason");
    }
  }
  return event;
}
