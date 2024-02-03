import type {
  Abi,
  AbiEvent,
  AbiParametersToPrimitiveTypes,
  ExtractAbiEventNames,
} from "abitype";
import type { ThirdwebContract } from "../contract/index.js";
import type { ParseEvent } from "../abi/types.js";
import type { Log } from "viem";

export type EventLog<abiEvent extends AbiEvent = AbiEvent> = Log<
  bigint,
  number,
  false,
  abiEvent,
  false,
  [abiEvent],
  abiEvent["name"]
>;

export type EventParams<event extends AbiEvent> = AbiParametersToPrimitiveTypes<
  event["inputs"]
>;

export type ContractEventOptions<
  abi extends Abi,
  event extends AbiEvent | string,
> = {
  contract: ThirdwebContract<abi>;
  event: event;
  params?: EventParams<ParseEvent<abi, event>>;
};

// the only difference here is that we don't alow string events
export type ContractEvent<event extends AbiEvent> = ContractEventOptions<
  Abi,
  event
>;

/**
 * Creates a contract event.
 * @param options - The options for creating the contract event.
 * @returns The contract event.
 * @example
 * ```ts
 * import { createClient, getContract } from "thirdweb";
 * import { prepareEvent } from "thirdweb";
 * const client = createClient({ clientId: "..." });
 * const contract = getContract({
 *  client,
 *  address: "...",
 * });
 * const myEvent = prepareEvent({
 *  contract,
 *  event: "MyEvent",
 * });
 * ```
 */
export function prepareEvent<
  const abi extends Abi,
  // if an abi has been passed into the contract, restrict the event to event names of the abi
  const event extends abi extends { length: 0 }
    ? AbiEvent | string
    : ExtractAbiEventNames<abi>,
>(options: ContractEventOptions<abi, event>) {
  return options as unknown as ContractEvent<ParseEvent<abi, event>>;
}

/**
 * Determines whether the given item is an ABI event.
 *
 * @param item - The item to check.
 * @returns True if the item is an ABI event, false otherwise.
 * @internal
 */
export function isAbiEvent(item: unknown): item is AbiEvent {
  return !!(
    item &&
    typeof item === "object" &&
    "type" in item &&
    item.type === "event"
  );
}
