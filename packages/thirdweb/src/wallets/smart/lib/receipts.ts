import { decodeErrorResult, type Hex } from "viem";
import type { Chain } from "../../../chains/index.js";
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
  if (event && event.args.success === false) {
    const revertOpEvent = prepareEvent({
      signature:
        "event UserOperationRevertReason(bytes32 indexed userOpHash, address indexed sender, uint256 nonce, bytes revertReason)",
      filters: {
        userOpHash: userOpHash as Hex,
      },
    });
    const revertEvent = await getContractEvents({
      contract: entryPointContract,
      events: [revertOpEvent],
      blockHash: event.blockHash,
    });
    const firstRevertEvent = revertEvent[0];
    if (firstRevertEvent) {
      const message = decodeErrorResult({
        data: firstRevertEvent.args.revertReason,
      });
      throw new Error(
        `UserOp failed with reason: '${message.args.join(",")}' at txHash: ${
          event.transactionHash
        }`,
      );
    } else {
      throw new Error(
        "UserOp failed with unknown reason with txHash: " +
          event.transactionHash,
      );
    }
  }
  return event;
}
