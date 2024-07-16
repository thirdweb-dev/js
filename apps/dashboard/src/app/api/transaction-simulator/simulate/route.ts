import { type NextRequest, NextResponse } from "next/server";
import {
  createThirdwebClient,
  defineChain,
  getContract,
  prepareContractCall,
  resolveMethod,
  simulateTransaction,
  toSerializableTransaction,
} from "thirdweb";

interface SimulateTransactionPayload {
  chainId: number;
  from: string;
  to: string;
  functionName: string;
  functionArgs: string;
  value: string;
}

export const POST = async (req: NextRequest) => {
  const requestBody = (await req.json()) as SimulateTransactionPayload;
  const { chainId, from, to, functionName, functionArgs, value } = requestBody;
  if (
    Number.isNaN(chainId) ||
    !from ||
    !to ||
    !functionName ||
    !functionArgs ||
    !value
  ) {
    return NextResponse.json(
      { error: "Invalid input params." },
      { status: 400 },
    );
  }

  const chain = defineChain({
    id: chainId,
    // @DEBUG: DO NOT MERGE THIS LINE
    rpc: `https://${chainId}.rpc.thirdweb-dev.com`,
  });

  const thirdwebClient = createThirdwebClient({
    secretKey: process.env.DASHBOARD_SECRET_KEY ?? "",
  });
  const contract = getContract({
    client: thirdwebClient,
    chain,
    address: to,
  });
  const transaction = await prepareContractCall({
    contract,
    method: resolveMethod(functionName),
    params: functionArgs.split(/[\n,]+/),
    value: BigInt(value),
  });

  try {
    const simulateResult = await simulateTransaction({
      from,
      transaction,
    });
    const { data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, value } =
      await toSerializableTransaction({
        from,
        transaction,
      });

    return NextResponse.json(
      {
        simulateResult,
        data,
        gas: gas.toString(),
        gasPrice: gasPrice?.toString(),
        maxFeePerGas: maxFeePerGas?.toString(),
        maxPriorityFeePerGas: maxPriorityFeePerGas?.toString(),
        value: value?.toString(),
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: `${e}` }, { status: 200 });
  }
};
