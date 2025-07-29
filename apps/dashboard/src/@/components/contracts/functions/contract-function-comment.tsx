import type { ThirdwebContract } from "thirdweb";
import { Badge } from "@/components/ui/badge";
import { CodeClient } from "@/components/ui/code/code.client";
import { useContractFunctionComment } from "@/hooks/contract-ui/useContractFunctionComment";

/**
 * Take in a contract & function, try to fetch the comment of that function
 */
export default function ContractFunctionComment({
  contract,
  functionName,
}: {
  contract: ThirdwebContract;
  functionName: string;
}) {
  const query = useContractFunctionComment(contract, functionName);

  if (query.isLoading) {
    return null;
  }
  if (!query.data) {
    return null;
  }
  return (
    <div>
      <h3 className="text-base font-semibold mt-6 mb-3">
        About this function <Badge>Beta</Badge>
      </h3>
      <CodeClient
        code={query.data}
        copyButtonClassName="hidden"
        lang="solidity"
        className="bg-background"
      />
    </div>
  );
}
