import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { isAddress } from "../../../../../../utils/address.js";
import { iconSize } from "../../../../../core/design-system/index.js";
import { useConnectionManager } from "../../../../../core/providers/connection-manager.js";
import { Spacer } from "../../../components/Spacer.js";
import { TextDivider } from "../../../components/TextDivider.js";
import { ToolTip } from "../../../components/Tooltip.js";
import { Container } from "../../../components/basic.js";
import { IconButton } from "../../../components/buttons.js";
import { Input } from "../../../components/formElements.js";
import { Text } from "../../../components/text.js";
import { WalletSelectorButton } from "./WalletSelectorButton.js";

export function ReceiverWalletDrawerScreen(props: {
  receiverAddress: string;
  onSelect: (address: string) => void;
  client: ThirdwebClient;
  onBack: () => void;
}) {
  const [address, setAddress] = useState<string>("");
  const isValidAddress = useMemo(() => isAddress(address), [address]);
  const showError = !!address && !isValidAddress;
  const connectionManager = useConnectionManager();
  const connectedWallets = useSyncExternalStore(
    connectionManager.connectedWallets.subscribe,
    connectionManager.connectedWallets.getValue,
  );

  function handleSubmit() {
    props.onSelect(address);
    props.onBack();
  }

  return (
    <div>
      <Text size="lg" color="primaryText">
        Send to
      </Text>
      <Spacer y="lg" />

      <div
        style={{
          position: "relative",
        }}
      >
        <Input
          data-error={showError}
          value={address}
          placeholder="Enter wallet address"
          variant="outline"
          onChange={(e) => setAddress(e.target.value)}
          style={{
            paddingRight: "50px",
          }}
          onKeyDown={(e) => {
            if (isValidAddress && e.key === "Enter") {
              handleSubmit();
            }
          }}
        />

        <ToolTip tip="Confirm">
          <IconButton
            disabled={!isValidAddress}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "40px",
            }}
            onClick={handleSubmit}
            aria-label="Confirm"
          >
            <ArrowRightIcon width={iconSize.md} height={iconSize.md} />
          </IconButton>
        </ToolTip>
      </div>

      {showError && (
        <>
          <Spacer y="xs" />
          <Text color="danger" size="sm">
            Invalid address
          </Text>
        </>
      )}

      <Spacer y="lg" />
      <TextDivider text="OR" />
      <Spacer y="md" />

      <Text size="sm">Connected</Text>
      <Spacer y="xs" />

      <Container flex="column" gap="sm">
        {connectedWallets.map((w) => {
          const address = (w.getAccount()?.address || "").toLowerCase();
          return (
            <WalletSelectorButton
              address={address}
              client={props.client}
              onClick={() => {
                props.onSelect(address);
                props.onBack();
              }}
              key={w.id}
              disableChevron
              checked={address === props.receiverAddress.toLowerCase()}
              walletId={w.id}
            />
          );
        })}
      </Container>
    </div>
  );
}
