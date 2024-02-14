import { parseAbiItem, type AbiEvent, type ParseAbiItem } from "abitype";
import { isAbiEvent } from "./utils.js";
import { toEventHash, type Hex, encodeEventTopics } from "viem";
import type { AbiEventParametersToPrimitiveTypes } from "./types.js";

type ParseEvent<event extends AbiEvent | string> =
  // if the method IS an AbiEvent, return it
  event extends AbiEvent
    ? event
    : event extends string // we now know we are in "string" territory
      ? // if the string starts with `function` then we can parse it
        event extends `event ${string}`
        ? ParseAbiItem<event>
        : // do we have an ABI to check, check the length
          AbiEvent
      : // this means its neither have an AbiEvent NOR a string -> never
        never;

type EventFilters<abiEvent extends AbiEvent> =
  AbiEventParametersToPrimitiveTypes<abiEvent["inputs"]>;

export type PrepareEventOptions<
  TSignature extends `event ${string}` | AbiEvent,
> = {
  signature: TSignature;
  filters?: Readonly<EventFilters<ParseEvent<TSignature>>>;
};

export type PreparedEvent<abiEvent extends AbiEvent> = {
  abiEvent: abiEvent;
  hash: Hex;
  topics: Hex[];
};

/**
 * Prepares an event by parsing the signature, generating the event hash, and encoding the event topics.
 * @param options - The options for preparing the event.
 * @returns The prepared event object.
 * @example
 * ```ts
 * import { prepareEvent } from "thirdweb";
 * const myEvent = prepareEvent({
 *  signature: "event MyEvent(uint256 myArg)",
 * });
 * ```
 */
export function prepareEvent<TSignature extends `event ${string}` | AbiEvent>(
  options: PrepareEventOptions<TSignature>,
): PreparedEvent<ParseEvent<TSignature>> {
  const { signature } = options;
  let resolvedSignature: ParseEvent<TSignature>;
  if (isAbiEvent(signature)) {
    resolvedSignature = signature as ParseEvent<TSignature>;
  } else {
    resolvedSignature = parseAbiItem(signature) as ParseEvent<TSignature>;
  }

  return {
    abiEvent: resolvedSignature,
    hash: toEventHash(resolvedSignature),
    // @ts-expect-error - TODO: investiagte why this complains, it works fine however
    topics: encodeEventTopics({
      abi: [resolvedSignature],
      args: options.filters,
    }),
  };
}
