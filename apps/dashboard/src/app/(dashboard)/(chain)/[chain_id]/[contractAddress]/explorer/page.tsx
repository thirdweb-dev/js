import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { resolveContractAbi } from "thirdweb/contract";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { ContractExplorerPage } from "./ContractExplorerPage";

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
    return <ContractExplorerPage contract={contract} abi={abi} />;
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
