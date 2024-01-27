import {
  formatAbiItem,
  type Abi,
  type AbiEvent,
  type ExtractAbiEventNames,
  type AbiParameter,
  type AbiParameterToPrimitiveType,
  parseAbiItem,
} from "abitype";
import { type ContractEventInput } from "../event.js";
import {
  hexToBigInt,
  toHex,
  type Log,
  toEventSelector,
  type Hex,
  toBytes,
  keccak256,
  FilterTypeNotSupportedError,
  encodeAbiParameters,
} from "viem";
import type { ParseEvent } from "../../abi/types.js";
import { getRpcClient } from "../../rpc/index.js";

type WatchOptions<
  abi extends Abi,
  // if an abi has been passed into the contract, restrict the event to event names of the abi
  event extends abi extends { length: 0 }
    ? AbiEvent | string
    : ExtractAbiEventNames<abi>,
> = {
  onLogs: (
    logs: Array<
      Log<
        bigint,
        number,
        boolean,
        ParseEvent<abi, event>,
        undefined,
        abi extends { length: 0 } ? [ParseEvent<abi, event>] : abi
      >
    >,
  ) => void | undefined;
} & ContractEventInput<abi, event>;

export function watch<
  const abi extends Abi,
  // if an abi has been passed into the contract, restrict the event to event names of the abi
  const event extends abi extends { length: 0 }
    ? AbiEvent | string
    : ExtractAbiEventNames<abi>,
>(options: WatchOptions<abi, event>) {
  const rpcRequest = getRpcClient(options.contract, {
    chainId: options.contract.chainId,
  });

  let lastBlock = 0n;
  const parsedEvent =
    typeof options.event === "string"
      ? parseAbiItem(options.event as any)
      : options.event;
  if (parsedEvent.type !== "event") {
    throw new Error("Expected event");
  }
  rpcRequest({
    method: "eth_blockNumber",
    params: [],
  }).then((x) => {
    lastBlock = hexToBigInt(x);
  });

  const interval = setInterval(async function () {
    const blockHex = await rpcRequest({
      method: "eth_blockNumber",
      params: [],
    });
    const newBlock = hexToBigInt(blockHex);

    if (lastBlock === 0n) {
      lastBlock = newBlock;
    } else if (newBlock > lastBlock) {
      const logs = await rpcRequest({
        method: "eth_getLogs",
        params: [
          {
            address: options.contract.address,
            topics: [
              encodeEventTopic({
                event: parsedEvent,
                params: (options.params || []) as unknown[],
              }),
            ],
            fromBlock: toHex(lastBlock + 1n),
            toBlock: toHex(newBlock),
          },
        ],
      });
      if (logs.length) {
        // TODO parsing etc
        options.onLogs(logs);
      }

      lastBlock = newBlock;
    }
  }, 5000);

  // return the unsubscribe function
  return function () {
    clearInterval(interval);
  };
}

// TODO clean all of this up

function encodeEventTopic({
  event,
  params,
}: {
  event: AbiEvent;
  params: unknown[];
}) {
  const definition = formatAbiItem(event);
  const signature = toEventSelector(definition);

  let topics: Hex[] = [];
  if (params && "inputs" in event) {
    const indexedInputs = event.inputs?.filter(
      (param) => "indexed" in param && param.indexed,
    );
    const args_ = Array.isArray(params)
      ? params
      : // TODO: bring this back
        // : Object.values(args).length > 0
        // ? indexedInputs?.map((x: any) => (args as any)[x.name]) ?? []
        [];

    if (args_.length > 0) {
      topics =
        indexedInputs?.map((param, i) =>
          Array.isArray(args_[i])
            ? (args_[i] as any).map((_: any, j: number) =>
                encodeArg({ param, value: (args_[i] as any)[j] }),
              )
            : args_[i]
              ? encodeArg({ param, value: args_[i] })
              : null,
        ) ?? [];
    }
  }
  return [signature, ...topics];
}

function encodeArg({
  param,
  value,
}: {
  param: AbiParameter;
  value: AbiParameterToPrimitiveType<AbiParameter>;
}) {
  if (param.type === "string" || param.type === "bytes") {
    return keccak256(toBytes(value as string));
  }
  if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/)) {
    throw new FilterTypeNotSupportedError(param.type);
  }
  return encodeAbiParameters([param], [value]);
}
