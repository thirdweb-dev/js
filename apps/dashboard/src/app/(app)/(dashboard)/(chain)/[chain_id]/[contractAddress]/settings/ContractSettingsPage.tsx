"use client";
import type { ThirdwebContract } from "thirdweb";
import * as CommonExt from "thirdweb/extensions/common";
import { cn } from "@/lib/utils";
import { SettingsMetadata } from "./components/metadata";
import { SettingsPlatformFees } from "./components/platform-fees";
import { SettingsPrimarySale } from "./components/primary-sale";
import { SettingsRoyalties } from "./components/royalties";

const ContractSettingsPageInner = (props: {
  contract: ThirdwebContract;
  isContractMetadataSupported: boolean;
  isPrimarySaleSupported: boolean;
  isRoyaltiesSupported: boolean;
  isPlatformFeesSupported: boolean;
  isLoggedIn: boolean;
}) => {
  return (
    <div className="flex flex-col gap-8">
      <div
        className={cn(
          props.isContractMetadataSupported ? "order-1" : "order-2",
        )}
      >
        <SettingsMetadata
          contract={props.contract}
          detectedState={
            props.isContractMetadataSupported ? "enabled" : "disabled"
          }
          isLoggedIn={props.isLoggedIn}
        />
      </div>

      <div className={cn(props.isPrimarySaleSupported ? "order-1" : "order-2")}>
        <SettingsPrimarySale
          contract={props.contract}
          detectedState={props.isPrimarySaleSupported ? "enabled" : "disabled"}
          isLoggedIn={props.isLoggedIn}
        />
      </div>

      <div className={cn(props.isRoyaltiesSupported ? "order-1" : "order-2")}>
        <SettingsRoyalties
          contract={props.contract}
          detectedState={props.isRoyaltiesSupported ? "enabled" : "disabled"}
          isLoggedIn={props.isLoggedIn}
        />
      </div>

      <div
        className={cn(props.isPlatformFeesSupported ? "order-1" : "order-2")}
      >
        <SettingsPlatformFees
          contract={props.contract}
          detectedState={props.isPlatformFeesSupported ? "enabled" : "disabled"}
          isLoggedIn={props.isLoggedIn}
        />
      </div>
    </div>
  );
};

export function ContractSettingsPage(props: {
  contract: ThirdwebContract;
  functionSelectors: string[];
  isLoggedIn: boolean;
  hasDefaultFeeConfig: boolean;
}) {
  const { functionSelectors, contract, isLoggedIn, hasDefaultFeeConfig } =
    props;
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-0.5">Settings</h2>
      <p className="text-muted-foreground mb-5">
        Configure the settings for your contract
      </p>

      <ContractSettingsPageInner
        contract={contract}
        isContractMetadataSupported={[
          CommonExt.isGetContractMetadataSupported(functionSelectors),
          CommonExt.isSetContractMetadataSupported(functionSelectors),
        ].every(Boolean)}
        isLoggedIn={isLoggedIn}
        isPlatformFeesSupported={
          !hasDefaultFeeConfig &&
          [
            CommonExt.isGetPlatformFeeInfoSupported(functionSelectors),
            CommonExt.isSetPlatformFeeInfoSupported(functionSelectors),
          ].every(Boolean)
        }
        isPrimarySaleSupported={[
          CommonExt.isPrimarySaleRecipientSupported(functionSelectors),
          CommonExt.isSetPrimarySaleRecipientSupported(functionSelectors),
        ].every(Boolean)}
        isRoyaltiesSupported={[
          CommonExt.isGetDefaultRoyaltyInfoSupported(functionSelectors),
          CommonExt.isSetDefaultRoyaltyInfoSupported(functionSelectors),
        ].every(Boolean)}
      />
    </div>
  );
}
