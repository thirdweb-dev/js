import type { ConnectUIProps } from "../../../types/wallets.js";
import { Spinner } from "../../../ui/components/Spinner.js";
import { Container } from "../../../ui/components/basic.js";
import { useSavedLocalWalletDataQuery } from "../utils/useSavedLocalWalletDataQuery.js";
import { LocalWallet_ConnectToSavedFlow } from "./connectToSaved/LocalWallet_ConnectToSavedFlow.js";
import { LocalWallet_Persist_CreationFlow } from "./create/LocalWallet_Persist_CreationFlow.js";

/**
 * UI to show when localWallet should be persisted
 * @internal
 */
export function LocalWallet_Persist(props: {
  persist: boolean;
  connectUIProps: ConnectUIProps;
}) {
  const savedDataQuery = useSavedLocalWalletDataQuery();

  if (savedDataQuery.isLoading) {
    return (
      <Container
        flex="row"
        center="both"
        style={{
          height: "300px",
        }}
      >
        <Spinner size="xl" color="accentText" />
      </Container>
    );
  }

  // if there is saved data, show UI for connecting to saved wallet
  if (savedDataQuery.data) {
    return (
      <LocalWallet_ConnectToSavedFlow
        persist={props.persist}
        connectUIProps={props.connectUIProps}
        savedData={savedDataQuery.data}
      />
    );
  }

  // if no data is saved -> create or import a wallet
  return (
    <LocalWallet_Persist_CreationFlow
      persist={props.persist}
      connectUIProps={props.connectUIProps}
      onBack={props.connectUIProps.screenConfig.goBack}
    />
  );
}
