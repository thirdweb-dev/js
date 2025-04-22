import { DEFAULT_FEE_RECIPIENT } from "constants/addresses";
import { notFound } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getPlatformFeeInfo } from "thirdweb/extensions/common";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractSettingsPage } from "./ContractSettingsPage";
import { ContractSettingsPageClient } from "./ContractSettingsPage.client";

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

  if (contract.chain.id === localhost.id) {
    const account = await getRawAccount();
    return (
      <ContractSettingsPageClient contract={contract} isLoggedIn={!!account} />
    );
  }

  const [account, metadata] = await Promise.all([
    getRawAccount(),
    getContractPageMetadata(info.contract),
  ]);

  let hasDefaultFeeConfig = true;
  try {
    const feeInfo = await getPlatformFeeInfo({ contract });
    hasDefaultFeeConfig =
      feeInfo[0].toLowerCase() === DEFAULT_FEE_RECIPIENT.toLowerCase();
  } catch {}

  return (
    <ContractSettingsPage
      contract={info.contract}
      functionSelectors={metadata.functionSelectors}
      isLoggedIn={!!account}
      hasDefaultFeeConfig={hasDefaultFeeConfig}
    />
  );
}
