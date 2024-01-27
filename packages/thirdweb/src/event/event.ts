import type {
  Abi,
  AbiEvent,
  AbiParametersToPrimitiveTypes,
  ExtractAbiEventNames,
} from "abitype";
import type { ThirdwebContract } from "../contract/index.js";
import type { ParseEvent } from "../abi/types.js";

type Params<event extends AbiEvent> = AbiParametersToPrimitiveTypes<
  event["inputs"]
>;

export type ContractEventInput<
  abi extends Abi,
  event extends AbiEvent | string,
> = {
  contract: ThirdwebContract<abi>;
  event: event;
  params?: Params<ParseEvent<abi, event>>;
};

// the only difference here is that we don't alow string events
export type ContractEvent<event extends AbiEvent> = ContractEventInput<
  Abi,
  event
>;

export function contractEvent<
  const abi extends Abi,
  // if an abi has been passed into the contract, restrict the event to event names of the abi
  const event extends abi extends { length: 0 }
    ? AbiEvent | string
    : ExtractAbiEventNames<abi>,
>(options: ContractEventInput<abi, event>) {
  return options as unknown as ContractEvent<ParseEvent<abi, event>>;
}
