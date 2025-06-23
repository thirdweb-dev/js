import type { Abi } from "abitype";
import { CircleAlertIcon } from "lucide-react";
import type { ChainMetadata } from "thirdweb/chains";
import type { ThirdwebContract } from "thirdweb/contract";
import { CodeOverview } from "@/components/contracts/code-overview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ContractCodePage(props: {
  abi: Abi | undefined;
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
}) {
  if (props.abi) {
    return (
      <CodeOverview
        abi={props.abi}
        chainId={props.contract.chain.id}
        contractAddress={props.contract.address}
      />
    );
  }

  return (
    <Alert variant="destructive">
      <CircleAlertIcon className="size-5" />
      <AlertTitle>Failed to resolve contract ABI</AlertTitle>
      <AlertDescription>
        Please verify that contract address is correct and deployed on "
        {props.chainMetadata.name}" chain.
      </AlertDescription>
    </Alert>
  );
}
