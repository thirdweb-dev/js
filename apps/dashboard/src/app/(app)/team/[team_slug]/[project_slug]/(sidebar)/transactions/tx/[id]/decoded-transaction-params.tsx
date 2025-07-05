import { getContract } from "thirdweb";
import { getCompilerMetadata } from "thirdweb/contracts";
import { decodeFunctionData, toFunctionSelector } from "thirdweb/utils";
import { CodeServer } from "@/components/ui/code/code.server";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import type { Transaction } from "../../analytics/tx-table/types";

type AbiFunction = {
  type: "function";
  name: string;
  inputs?: Array<{
    name: string;
    type: string;
  }>;
};

type AbiItem =
  | AbiFunction
  | {
      type: string;
      name?: string;
    };

interface DecodedTransactionParamsProps {
  transaction: Transaction;
}

export async function DecodedTransactionParams({
  transaction,
}: DecodedTransactionParamsProps) {
  // Check if we have transaction parameters
  if (
    !transaction.transactionParams ||
    transaction.transactionParams.length === 0
  ) {
    return (
      <p className="text-muted-foreground text-sm">
        No transaction parameters available to decode
      </p>
    );
  }

  // Get the first transaction parameter (assuming single transaction)
  const txParam = transaction.transactionParams[0];
  if (!txParam || !txParam.to || !txParam.data) {
    return (
      <p className="text-muted-foreground text-sm">
        Transaction data is incomplete for decoding
      </p>
    );
  }

  try {
    // Create contract instance
    const contract = getContract({
      client: serverThirdwebClient,
      address: txParam.to,
      chain: transaction.chainId
        ? { id: parseInt(transaction.chainId) }
        : undefined,
    });

    // Fetch compiler metadata
    const compilerMetadata = await getCompilerMetadata(contract);

    if (!compilerMetadata || !compilerMetadata.abi) {
      return (
        <div className="space-y-4">
          <div>
            <div className="text-muted-foreground text-sm">
              Contract Address
            </div>
            <div className="font-mono text-sm">{txParam.to}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm">Error</div>
            <div className="text-sm">
              Unable to fetch contract metadata. The contract may not have
              verified metadata available.
            </div>
          </div>
        </div>
      );
    }

    const contractName = compilerMetadata.name || "Unknown Contract";
    const abi = compilerMetadata.abi;

    // Extract function selector from transaction data (first 4 bytes)
    const functionSelector = txParam.data.slice(0, 10) as `0x${string}`;

    // Find matching function in ABI
    const functions = (abi as AbiItem[]).filter(
      (item): item is AbiFunction => item.type === "function",
    );
    let matchingFunction: AbiFunction | null = null;

    for (const func of functions) {
      const selector = toFunctionSelector(func);
      if (selector === functionSelector) {
        matchingFunction = func;
        break;
      }
    }

    if (!matchingFunction) {
      return (
        <div className="space-y-4">
          <div>
            <div className="text-muted-foreground text-sm">Contract Name</div>
            <div className="font-mono text-sm">{contractName}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm">
              Function Selector
            </div>
            <div className="font-mono text-sm">{functionSelector}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm">Error</div>
            <div className="text-sm">
              No matching function found in contract ABI for selector{" "}
              {functionSelector}
            </div>
          </div>
        </div>
      );
    }

    const functionName = matchingFunction.name;

    // Decode function data
    const decodedData = decodeFunctionData({
      abi: [matchingFunction],
      data: txParam.data,
    });

    // Create a clean object for display
    const functionArgs: Record<string, unknown> = {};
    if (matchingFunction.inputs && decodedData.args) {
      for (let index = 0; index < matchingFunction.inputs.length; index++) {
        const input = matchingFunction.inputs[index];
        if (input) {
          functionArgs[input.name || `arg${index}`] = decodedData.args[index];
        }
      }
    }

    return (
      <div className="space-y-4">
        <div>
          <div className="text-muted-foreground text-sm">Contract Name</div>
          <div className="font-mono text-sm">{contractName}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">Function Name</div>
          <div className="font-mono text-sm">{functionName}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">
            Function Arguments
          </div>
          <CodeServer
            code={JSON.stringify(functionArgs, null, 2)}
            lang="json"
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error decoding transaction:", error);
    return (
      <div className="space-y-4">
        <div>
          <div className="text-muted-foreground text-sm">Contract Address</div>
          <div className="font-mono text-sm">{txParam.to}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">Error</div>
          <div className="text-sm">
            Failed to decode transaction data:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </div>
      </div>
    );
  }
}
