import { useState } from "react";
import type { ConnectUIProps } from "../../../../types/wallets.js";
import { ExportSavedLocalWallet } from "../ExportSavedLocalWallet.js";
import { OverrideConfirmation } from "./overrideConfirmation.js";
import type { LocalWalletStorageData } from "../../../../../wallets/local/types.js";
import { LocalWallet_ConnectToSaved } from "./LocalWallet_ConnectToSaved.js";
import { LocalWallet_Persist_CreationFlow } from "../create/LocalWallet_Persist_CreationFlow.js";

/**
 * - Show UI to connect to saved local wallet
 * - shows a "create" option too
 * - clicking on "create" shows OverrideConfirmation and asks user to backup wallet
 * - once backed up, creation flow is shown
 * @internal
 */
export function LocalWallet_ConnectToSavedFlow(props: {
  connectUIProps: ConnectUIProps;
  persist: boolean;
  savedData: LocalWalletStorageData;
}) {
  const [screen, setScreen] = useState<"main" | "create" | "export" | "backup">(
    "main",
  );

  if (screen === "main") {
    return (
      <LocalWallet_ConnectToSaved
        connectUIProps={props.connectUIProps}
        persist={props.persist}
        savedData={props.savedData}
        onBackupWallet={() => {
          setScreen("backup");
        }}
      />
    );
  }

  if (screen === "export") {
    return (
      <ExportSavedLocalWallet
        onBack={() => {
          setScreen("main");
        }}
        onExport={() => {
          setScreen("create");
        }}
        connectUIProps={props.connectUIProps}
        savedData={props.savedData}
      />
    );
  }

  if (screen === "backup") {
    return (
      <OverrideConfirmation
        connectUIProps={props.connectUIProps}
        onBackup={() => {
          setScreen("export");
        }}
        onBack={() => {
          setScreen("main");
        }}
        onSkip={() => {
          setScreen("create");
        }}
      />
    );
  }

  if (screen === "create") {
    return (
      <LocalWallet_Persist_CreationFlow
        onBack={() => {
          setScreen("main");
        }}
        persist={props.persist}
        connectUIProps={props.connectUIProps}
      />
    );
  }

  return null;
}
