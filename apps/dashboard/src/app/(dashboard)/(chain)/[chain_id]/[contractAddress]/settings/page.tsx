import { notFound } from "next/navigation";
import * as CommonExt from "thirdweb/extensions/common";
import { ContractSettingsPage } from "../../../../../../contract-ui/tabs/settings/page";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";

export default async function Page(props: {
  params: {
    contractAddress: string;
    chain_id: string;
  };
}) {
  const info = await getContractPageParamsInfo(props.params);

  if (!info) {
    notFound();
  }

  const { functionSelectors } = await getContractPageMetadata(info.contract);

  return (
    <ContractSettingsPage
      contract={info.contract}
      isContractMetadataSupported={[
        CommonExt.isGetContractMetadataSupported(functionSelectors),
        CommonExt.isSetContractMetadataSupported(functionSelectors),
      ].every(Boolean)}
      isPrimarySaleSupported={[
        CommonExt.isPrimarySaleRecipientSupported(functionSelectors),
        CommonExt.isSetPrimarySaleRecipientSupported(functionSelectors),
      ].every(Boolean)}
      isRoyaltiesSupported={[
        CommonExt.isGetDefaultRoyaltyInfoSupported(functionSelectors),
        CommonExt.isSetDefaultRoyaltyInfoSupported(functionSelectors),
      ].every(Boolean)}
      isPlatformFeesSupported={[
        CommonExt.isGetPlatformFeeInfoSupported(functionSelectors),
        CommonExt.isSetPlatformFeeInfoSupported(functionSelectors),
      ].every(Boolean)}
    />
  );
}
