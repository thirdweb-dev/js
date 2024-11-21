import { Badge } from "@/components/ui/badge";
import { CodeClient } from "@/components/ui/code/code.client";
import { useContractSources } from "contract-ui/hooks/useContractSources";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";

/**
 * Take in a contract & function, try to fetch the comment of that function
 */
export default function ContractFunctionComment({
  contract,
  functionName,
}: { contract: ThirdwebContract; functionName: string }) {
  const sourceQuery = useContractSources(contract);
  const comment = useMemo(() => {
    if (!sourceQuery.data?.length) {
      return null;
    }
    const file = sourceQuery.data.find((item) =>
      item.source.includes(functionName),
    );
    if (!file) {
      return null;
    }
    return extractFunctionComment(file.source, functionName);
  }, [sourceQuery.data, functionName]);

  if (sourceQuery.isLoading) {
    return null;
  }
  if (!comment) {
    return null;
  }
  return (
    <>
      <p className="mt-6">
        About this function <Badge>Beta</Badge>
      </p>
      <CodeClient lang="solidity" code={comment} />
    </>
  );
}

function extractFunctionComment(
  // Tthe whole code from the solidity file containing (possibly) the function
  solidityCode: string,
  functionName: string,
): string | null {
  // Regular expression to match function declarations and their preceding comments
  // This regex now captures both single-line (//) and multi-line (/** */) comments
  const functionRegex =
    /(?:\/\/[^\n]*|\/\*\*[\s\S]*?\*\/)\s*function\s+(\w+)\s*\(/g;

  while (true) {
    const match = functionRegex.exec(solidityCode);
    if (match === null) {
      return null;
    }
    const [fullMatch, name] = match;
    if (!fullMatch || !fullMatch.length) {
      return null;
    }
    if (name === functionName) {
      // Extract the comment part
      const comment = (fullMatch.split("function")[0] || "").trim();
      if (!comment) {
        return null;
      }

      if (/^[^a-zA-Z0-9]+$/.test(comment)) {
        return null;
      }
      return comment;
    }
  }
}
