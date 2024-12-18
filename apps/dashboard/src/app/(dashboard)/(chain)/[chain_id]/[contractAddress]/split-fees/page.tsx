import { notFound, redirect } from "next/navigation";
import { getContractEvents, prepareEvent, readContract } from "thirdweb";
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
const splitFeesCoreAddress = "0x640a2bb44A4c3644B416aCA8e60C67B11E41C8DF";

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

  const splits = await Promise.all(
    events
      .filter(
        (e) =>
          (e.args as { referenceContract: string }).referenceContract ===
          contract.address,
      )
      .map(async (e) => {
        const split = await readContract({
          contract: splitFeesCore,
          method: {
            type: "function",
            name: "getSplit",
            inputs: [
              {
                name: "_splitWallet",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "tuple",
                internalType: "struct Split",
                components: [
                  {
                    name: "controller",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "recipients",
                    type: "address[]",
                    internalType: "address[]",
                  },
                  {
                    name: "allocations",
                    type: "uint256[]",
                    internalType: "uint256[]",
                  },
                  {
                    name: "totalAllocation",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
            ],
            stateMutability: "view",
          },
          params: [(e.args as { splitWallet: string }).splitWallet],
        });
        return {
          splitWallet: (e.args as { splitWallet: string }).splitWallet,
          recipients: split.recipients,
          allocations: split.allocations,
          controller: split.controller,
          referenceContract: contract.address,
        };
      }),
  );
  console.log("splits: ", splits);

  return (
    <SplitFees
      splitFeesCore={splitFeesCore}
      splits={splits}
      coreContract={contract}
    />
  );
}
