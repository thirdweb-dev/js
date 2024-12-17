import { notFound, redirect } from "next/navigation";
import { getContractEvents, prepareEvent } from "thirdweb";
import { type FetchDeployMetadataResult, getContract } from "thirdweb/contract";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import SplitFees from "./SplitFees";

export function getModuleInstallParams(mod: FetchDeployMetadataResult) {
  return (
    mod.abi
      .filter((a) => a.type === "function")
      .find((f) => f.name === "encodeBytesOnInstall")?.inputs || []
  );
}

// TODO: place this somwhere appropriate
const splitFeesCoreAddress = "0x7d6Ba9e63eFb30c42b25db50dBD3C2F0a4578Ba2";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const params = await props.params;
  const info = await getContractPageParamsInfo(params);

  if (!info) {
    notFound();
  }

  const { contract } = info;

  const { isModularCore } = await getContractPageMetadata(contract);

  if (!isModularCore) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }
  const splitFeesCore = getContract({
    address: splitFeesCoreAddress,
    client: contract.client,
    chain: contract.chain,
  });

  const events = await getContractEvents({
    contract: splitFeesCore,
    events: [
      prepareEvent({
        signature:
          "event SplitCreated(address indexed splitWallet, address[] recipients, uint256[] allocations, address controller, address referenceContract)",
        filters: {
          referenceContract: contract.address,
        },
      }),
    ],
    blockRange: 123456n,
  });

  const splits = events.map((e) => {
    const args = e.args as {
      splitWallet: string;
      recipients: string[];
      allocations: bigint[];
      controller: string;
      referenceContract: string;
    };
    return {
      splitWallet: args.splitWallet,
      recipients: args.recipients,
      allocations: args.allocations,
      controller: args.controller,
      referenceContract: args.referenceContract,
    };
  });
  console.log("splits: ", splits);

  return (
    <SplitFees
      splitFeesCore={splitFeesCore}
      splits={splits}
      coreContract={contract}
    />
  );
}
