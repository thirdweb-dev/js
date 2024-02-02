import { parseAbiItem, type Abi, type AbiEvent } from "abitype";
import {
  isAbiEvent,
  type ContractEvent,
  type ContractEventOptions,
} from "../event.js";
import type { ParseEvent } from "~thirdweb/abi/types.js";

const ABI_EVENT_RESOLUTION_CACHE = new WeakMap<
  ContractEvent<AbiEvent>,
  Promise<AbiEvent>
>();

/**
 * Resolves the ABI event for a given contract event.
 *
 * @param contractEvent - The contract event to resolve the ABI event for.
 * @returns A promise that resolves to the parsed ABI event.
 * @throws An error if the ABI event cannot be resolved.
 * @internal
 */
export function resolveAbiEvent<
  abiEvent extends AbiEvent | string,
  abi extends Abi,
>(
  contractEvent: ContractEventOptions<abi, abiEvent>,
): Promise<ParseEvent<abi, abiEvent>> {
  if (
    ABI_EVENT_RESOLUTION_CACHE.has(contractEvent as ContractEvent<AbiEvent>)
  ) {
    return ABI_EVENT_RESOLUTION_CACHE.get(
      contractEvent as ContractEvent<AbiEvent>,
    ) as Promise<ParseEvent<abi, abiEvent>>;
  }
  const prom = (async () => {
    if (isAbiEvent(contractEvent.event)) {
      return contractEvent.event as ParseEvent<abi, abiEvent>;
    }
    // if the method starts with the string `event ` we always will want to try to parse it
    if (contractEvent.event.startsWith("event ")) {
      const abiItem = parseAbiItem(contractEvent.event);
      if (abiItem.type === "event") {
        return abiItem as ParseEvent<abi, abiEvent>;
      }
      throw new Error(`"method" passed is not of type "function"`);
    }
    // check if we have a "abi" on the contract
    if (contractEvent.contract.abi && contractEvent.contract.abi?.length > 0) {
      // extract the abiEv from it
      const abiEv = contractEvent.contract.abi?.find(
        (item) => item.type === "event" && item.name === contractEvent.event,
      );
      // if we were able to find it -> return it
      if (isAbiEvent(abiEv)) {
        return abiEv as ParseEvent<abi, abiEvent>;
      }
    }

    // if we get here we need to async resolve the ABI and try to find the method on there
    const { resolveContractAbi } = await import(
      "../../contract/actions/resolve-abi.js"
    );

    const abi = await resolveContractAbi(contractEvent.contract);
    // we try to find the abiEv in the abi
    const abiEv = abi.find((item) => {
      // if the item is not an event we can ignore it
      if (item.type !== "event") {
        return false;
      }
      // if the item is a function we can compare the name
      return item.name === contractEvent.event;
    }) as ParseEvent<abi, abiEvent> | undefined;

    if (!abiEv) {
      throw new Error(
        `could not find event with name ${contractEvent.event} in abi`,
      );
    }
    return abiEv;
  })();
  ABI_EVENT_RESOLUTION_CACHE.set(
    contractEvent as ContractEvent<AbiEvent>,
    prom,
  );
  return prom;
}
