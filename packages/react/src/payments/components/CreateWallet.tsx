import { createWallet, initialiseCreateWallet } from "@paperxyz/js-client-sdk";
import type {
  Locale,
  SupportedChainName,
} from "@paperxyz/sdk-common-utilities";
import type { PaperSDKError, PaperUser } from "@thirdweb-dev/payments";
import React, { useEffect } from "react";
import { usePaperSDKContext } from "../Provider";
import { Button } from "./common/Button";
const packageJson = require("../../package.json");

interface CreateWalletProps {
  emailAddress: string;
  onSuccess: (user: PaperUser) => void;
  onEmailVerificationInitiated?: () => void;
  onError?: (error: PaperSDKError) => void;
  chainName?: SupportedChainName;
  redirectUrl?: string;
  clientId?: string;
  locale?: Locale;
  children?: ({
    createWallet,
  }: {
    createWallet: (email: string) => void;
  }) => React.ReactNode | React.ReactNode;
}

export const CreateWallet: React.FC<CreateWalletProps> = ({
  emailAddress,
  redirectUrl,
  onSuccess,
  onEmailVerificationInitiated,
  onError,
  chainName,
  locale,
  clientId,
  children,
}) => {
  const isChildrenFunction = typeof children === "function";
  const { chainName: chainNameContext } = usePaperSDKContext();
  const chainNameToUse = chainName || chainNameContext;

  useEffect(() => {
    initialiseCreateWallet({
      onSuccess,
      onEmailVerificationInitiated,
      onError,
      locale,
    }).catch((e) => {
      console.error(e);
    });
  }, []);

  const executeVerifyEmail = async (emailAddressOverride?: string) => {
    await createWallet({
      chainName: chainNameToUse,
      emailAddress: emailAddressOverride ? emailAddressOverride : emailAddress,
      clientId,
      redirectUrl,
    });
  };

  return (
    <>
      {children && isChildrenFunction ? (
        children({ createWallet: executeVerifyEmail })
      ) : children ? (
        <div
          onClick={() => {
            executeVerifyEmail().catch((e) => {
              console.error(e);
            });
          }}
          data-paper-sdk-version={`@paperxyz/react-client-sdk@${packageJson.version}`}
        >
          {children}
        </div>
      ) : (
        <Button
          onClick={() => {
            executeVerifyEmail().catch((e) => {
              console.error(e);
            });
          }}
          data-paper-sdk-version={`@paperxyz/react-client-sdk@${packageJson.version}`}
        >
          Create Wallet
        </Button>
      )}
    </>
  );
};
