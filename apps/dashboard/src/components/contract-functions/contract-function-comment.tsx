import { Badge } from "@/components/ui/badge";
import { CodeClient } from "@/components/ui/code/code.client";
import { useContractFunctionComment } from "contract-ui/hooks/useContractFunctionComment";
import type { ThirdwebContract } from "thirdweb";

/**
 * Take in a contract & function, try to fetch the comment of that function
 */
export default function ContractFunctionComment({
  contract,
  functionName,
}: { contract: ThirdwebContract; functionName: string }) {
  const query = useContractFunctionComment(contract, functionName);

  if (query.isLoading) {
    return null;
  }
  if (!query.data) {
    return null;
  }
  return (
    <>
      <p className="mt-6">
        About this function <Badge>Beta</Badge>
      </p>
      <CodeClient
        lang="wikitext"
        code={query.data}
        copyButtonClassName="hidden"
      />
    </>
  );
}
