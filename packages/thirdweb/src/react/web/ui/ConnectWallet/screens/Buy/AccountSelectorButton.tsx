import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import type {
  Account,
  Wallet,
} from "../../../../../../wallets/interfaces/wallet.js";
import { shortenString } from "../../../../../core/utils/addresses.js";
import { WalletImage } from "../../../components/WalletImage.js";
import { Container } from "../../../components/basic.js";
import { Text } from "../../../components/text.js";
import { iconSize } from "../../../design-system/index.js";
import { WalletIcon } from "../../icons/WalletIcon.js";
import { SecondaryButton } from "./buttons.js";

/**
 *
 * @internal
 */
export function AccountSelectorButton(props: {
  onClick: () => void;
  activeWallet: Wallet;
  activeAccount: Account;
  address: string;
  chevron?: boolean;
  client: ThirdwebClient;
}) {
  return (
    <SecondaryButton variant="secondary" fullWidth onClick={props.onClick}>
      {props.activeAccount.address === props.address ? (
        <WalletImage
          id={props.activeWallet.id}
          size={iconSize.md}
          client={props.client}
        />
      ) : (
        <Container color="secondaryText" flex="row" center="both">
          <WalletIcon size={iconSize.md} />
        </Container>
      )}

      <Text size="sm" color="primaryText">
        {shortenString(props.address, false)}
      </Text>
      {props.chevron && (
        <ChevronDownIcon
          width={iconSize.sm}
          height={iconSize.sm}
          style={{
            marginLeft: "auto",
          }}
        />
      )}
    </SecondaryButton>
  );
}
