import styled from "@emotion/styled";
import { useMemo, useState } from "react";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { isAddress } from "../../../../../../utils/address.js";
import type {
  Account,
  Wallet,
} from "../../../../../../wallets/interfaces/wallet.js";
import { Spacer } from "../../../components/Spacer.js";
import { Container } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Input } from "../../../components/formElements.js";
import { Text } from "../../../components/text.js";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider.js";
import { AccountSelectorButton } from "./AccountSelectorButton.js";

/**
 * @internal
 */
export function AccountSelectionScreen(props: {
  activeWallet: Wallet;
  activeAccount: Account;
  onSelect: (address: string) => void;
  client: ThirdwebClient;
}) {
  const [address, setAddress] = useState<string>("");
  const isValidAddress = useMemo(() => isAddress(address), [address]);
  const showError = !!address && !isValidAddress;

  return (
    <div>
      <Text size="lg" color="primaryText">
        Send to
      </Text>
      <Spacer y="lg" />
      <Container
        flex="row"
        center="y"
        style={{
          flexWrap: "nowrap",
          height: "50px",
        }}
      >
        <StyledInput
          data-is-error={showError}
          value={address}
          placeholder="Enter wallet address"
          variant="outline"
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button
          variant="accent"
          disabled={!isValidAddress}
          style={{
            height: "100%",
            minWidth: "100px",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          onClick={() => {
            props.onSelect(address);
          }}
        >
          Confirm
        </Button>
      </Container>

      {showError && (
        <>
          <Spacer y="xxs" />
          <Text color="danger" size="sm">
            Invalid address
          </Text>
        </>
      )}

      <Spacer y="xl" />
      <Text size="sm">Connected</Text>
      <Spacer y="xs" />
      <AccountSelectorButton
        client={props.client}
        address={props.activeAccount.address}
        activeAccount={props.activeAccount}
        activeWallet={props.activeWallet}
        onClick={() => {
          props.onSelect(props.activeAccount.address);
        }}
      />
    </div>
  );
}

const StyledInput = /* @__PURE__ */ styled(Input)(() => {
  const theme = useCustomTheme();
  return {
    border: `1.5px solid ${theme.colors.borderColor}`,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    height: "100%",
    boxSizing: "border-box",
    boxShadow: "none",
    borderRight: "none",
    "&:focus": {
      boxShadow: "none",
      borderColor: theme.colors.accentText,
    },
    "&[data-is-error='true']": {
      boxShadow: "none",
      borderColor: theme.colors.danger,
    },
  };
});
