import { decodeFunctionResult } from "../../abi/decode.js";
import type { AbiFunction, AbiParametersToPrimitiveTypes } from "abitype";
import type { Transaction } from "../index.js";

export async function read<const abiFn extends AbiFunction>(
  tx: Transaction<abiFn>,
): Promise<
  // if the outputs are 0 length, return never, invalid case
  abiFn["outputs"] extends { length: 0 }
    ? never
    : abiFn["outputs"] extends { length: 1 }
      ? // if the outputs are 1 length, we'll always return the first element
        AbiParametersToPrimitiveTypes<abiFn["outputs"]>[0]
      : // otherwise we'll return the array
        AbiParametersToPrimitiveTypes<abiFn["outputs"]>
> {
  if (!tx._encoded) {
    // import the encode function only when it is needed
    const { encode } = await import("./encode.js");

    tx._encoded = encode(tx);
  }

  const [encodedData, resolvedAbi] = await Promise.all([tx._encoded, tx.abi()]);
  if (!resolvedAbi) {
    throw new Error("Unable to resolve ABI");
  }

  const rpcRequest = tx.client.rpc({ chainId: tx.inputs.chainId });

  const { result } = await rpcRequest({
    method: "eth_call",
    params: [
      {
        to: tx.inputs.address,
        data: encodedData,
      },
      "latest",
    ],
  });

  const decoded = decodeFunctionResult(resolvedAbi, result);

  if (Array.isArray(decoded) && decoded.length === 1) {
    return decoded[0];
  }

  // @ts-expect-error - not sure why this complains but it works fine
  return decoded;
}
