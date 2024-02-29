import { useState } from "react";
import type { ConnectUIProps } from "../../../../types/wallets.js";
import { LocalWallet_Persist_Create } from "./LocalWallet_Persist_Create.js";
import { ImportLocalWallet } from "./ImportLocalWallet.js";

/**
 * UI to show when no local wallet is saved
 * - prompt user to create a new wallet
 * - show a link to import a wallet
 * - when clicked on import, show the import UI
 * @internal
 */
export function LocalWallet_Persist_CreationFlow(props: {
  connectUIProps: ConnectUIProps;
  persist: boolean;
  onBack?: () => void;
}) {
  const [screen, setScreen] = useState<"create" | "import">("create");

  if (screen === "import") {
    return (
      <ImportLocalWallet
        connectUIProps={props.connectUIProps}
        goBack={() => {
          setScreen("create");
        }}
        persist={props.persist}
      />
    );
  }

  return (
    <LocalWallet_Persist_Create
      {...props}
      onShowImportScreen={() => {
        setScreen("import");
      }}
    />
  );
}
