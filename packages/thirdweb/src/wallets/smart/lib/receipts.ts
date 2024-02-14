import { decodeAbiParameters, type Hex } from "viem";
import type { Chain } from "../../../chain/index.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { getContractEvents, prepareEvent } from "../../../event/index.js";
import { ENTRYPOINT_ADDRESS } from "./constants.js";

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
    signature:
      "event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)",
    // actually only want *this* userOpHash, so we can filter here
    filters: {
      userOpHash: userOpHash as Hex,
      // TODO: @joaquim can we filter by sender and paymaster, too?
    },
  });
  const events = await getContractEvents({
    contract: entryPointContract,
    events: [userOpEvent],
    fromBlock,
  });

  // no longe need to `find` here because we already filter in the getContractEvents() call above
  const event = events[0];
  // UserOp can revert, so we need to surface revert reason
  if (event?.args.success === false) {
    const revertOpEvent = prepareEvent({
      signature:
        "event UserOperationRevertReasonEvent(bytes32 indexed userOpHash, address indexed sender, uint256 nonce, bytes revertReason)",
    });
    const revertEvent = await getContractEvents({
      contract: entryPointContract,
      events: [revertOpEvent],
      fromBlock: event?.blockNumber,
      toBlock: event?.blockNumber,
    });
    const firstRevertEvent = revertEvent[0];
    if (firstRevertEvent) {
      let message: string = firstRevertEvent.args.revertReason;
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
