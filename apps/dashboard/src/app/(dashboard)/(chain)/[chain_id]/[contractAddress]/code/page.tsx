import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { resolveContractAbi } from "thirdweb/contract";
import { CodeOverview } from "../../../../../../contract-ui/tabs/code/components/code-overview";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const info = await getContractPageParamsInfo((await props.params));

  if (!info) {
    notFound();
  }

  const { contract, chainMetadata } = info;

  try {
    const abi = await resolveContractAbi(contract);

    return (
      <CodeOverview
        abi={abi}
        contractAddress={contract.address}
        chainId={contract.chain.id}
      />
    );
  } catch {
    return (
      <Alert variant="destructive">
        <CircleAlertIcon className="size-5" />
        <AlertTitle>Failed to resolve contract ABI</AlertTitle>
        <AlertDescription>
          Please verify that contract address is correct and deployed on "
          {chainMetadata.name}" chain.
        </AlertDescription>
      </Alert>
    );
  }
}
