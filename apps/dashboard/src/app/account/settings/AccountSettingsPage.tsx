"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import { AccountSettingsPageUI } from "./AccountSettingsPageUI";

export function AccountSettingsPage(props: {
  account: Account;
  client: ThirdwebClient;
}) {
  return (
    <AccountSettingsPageUI
      account={props.account}
      updateAccountImage={async (file) => {
        if (file) {
          // upload to IPFS
          const ipfsUri = await upload({
            client: props.client,
            files: [file],
          });

          // TODO - Implement updating the account image with uri
          console.log(ipfsUri);
        } else {
          // TODO - Implement deleting the account image
        }

        throw new Error("Not implemented");
      }}
    />
  );
}
