import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { shortenAddress } from "../../../../../../utils/address.js";
import type { WalletId } from "../../../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../../core/design-system/index.js";
import { useConnectedWalletDetails } from "../../../../../core/utils/wallet.js";
import { useConnectedWallets } from "../../../../hooks/wallets/useConnectedWallets.js";
import { Img } from "../../../components/Img.js";
import { WalletImage } from "../../../components/WalletImage.js";
import { Container } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { GenericWalletIcon } from "../../icons/GenericWalletIcon.js";
import { SmartWalletBadgeIcon } from "../../icons/SmartAccountBadgeIcon.js";

export function WalletSelectorButton(props: {
  address: string;
  walletId: WalletId | undefined;
  onClick: () => void;
  client: ThirdwebClient;
  containerStyle?: React.CSSProperties;
  disableChevron?: boolean;
  disabled?: boolean;
  checked?: boolean;
}) {
  const theme = useCustomTheme();
  const connectedWallets = useConnectedWallets();
  const wallet = connectedWallets.find(
    (x) => x.getAccount()?.address === props.address,
  );
  const walletId = props.walletId || wallet?.id;
  const { ensAvatarQuery, addressOrENS } = useConnectedWalletDetails(
    props.client,
    wallet?.getChain(),
    wallet?.getAccount(),
  );

  return (
    <Container
      bg="tertiaryBg"
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${theme.colors.borderColor}`,
        ...props.containerStyle,
      }}
    >
      <Button
        fullWidth
        disabled={props.disabled}
        onClick={props.onClick}
        variant="ghost"
        style={{
          justifyContent: "space-between",
          padding: spacing.sm,
          backgroundColor: theme.colors.tertiaryBg,
        }}
        gap="sm"
      >
        <Container flex="row" center="y" gap="sm" color="secondaryText">
          {ensAvatarQuery.data ? (
            <Img
              src={ensAvatarQuery.data}
              width={iconSize.md}
              height={iconSize.md}
              style={{
                borderRadius: radius.sm,
              }}
              client={props.client}
            />
          ) : walletId ? (
            <WalletImage
              id={walletId}
              size={iconSize.md}
              client={props.client}
            />
          ) : (
            <GenericWalletIcon size={iconSize.md} />
          )}

          <Text size="sm" color="primaryText">
            {addressOrENS || shortenAddress(props.address)}
          </Text>
          {walletId === "smart" && (
            <Container color="accentText" center="both">
              <SmartWalletBadgeIcon size={iconSize.sm} />
            </Container>
          )}
        </Container>
        {!props.disableChevron && (
          <ChevronDownIcon
            width={iconSize.sm}
            height={iconSize.sm}
            style={{
              color: theme.colors.secondaryText,
            }}
          />
        )}

        {props.checked && (
          <CheckIcon width={iconSize.md} height={iconSize.md} />
        )}
      </Button>
    </Container>
  );
}
