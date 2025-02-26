import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { shortenAddress } from "../../../../../../../utils/address.js";
import { isEcosystemWallet } from "../../../../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import { isSmartWallet } from "../../../../../../../wallets/smart/index.js";
import {
  fontSize,
  iconSize,
} from "../../../../../../core/design-system/index.js";
import { useConnectedWallets } from "../../../../../../core/hooks/wallets/useConnectedWallets.js";
import {
  useEnsName,
  useWalletInfo,
} from "../../../../../../core/utils/wallet.js";
import { useProfiles } from "../../../../../hooks/wallets/useProfiles.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { WalletImage } from "../../../../components/WalletImage.js";
import { Container } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";
import { OutlineWalletIcon } from "../../../icons/OutlineWalletIcon.js";

export function WalletRow(props: {
  client: ThirdwebClient;
  address: string;
  iconSize?: keyof typeof iconSize;
  textSize?: keyof typeof fontSize;
  label?: string;
}) {
  const { client, address } = props;
  const connectedWallets = useConnectedWallets();
  const profile = useProfiles({ client });
  const wallet = connectedWallets.find(
    (w) => w.getAccount()?.address?.toLowerCase() === address.toLowerCase(),
  );
  const email =
    wallet &&
    (wallet.id === "inApp" ||
      isEcosystemWallet(wallet) ||
      isSmartWallet(wallet))
      ? profile.data?.find((p) => !!p.details.email)?.details.email
      : undefined;
  const walletInfo = useWalletInfo(wallet?.id);
  const ensNameQuery = useEnsName({
    client,
    address,
  });
  const addressOrENS = ensNameQuery.data || shortenAddress(address);
  return (
    <Container flex="row" style={{ justifyContent: "space-between" }}>
      <Container flex="row" center="y" gap="sm" color="secondaryText">
        {wallet ? (
          <WalletImage
            id={wallet.id}
            size={iconSize[props.iconSize || "md"]}
            client={props.client}
          />
        ) : (
          <OutlineWalletIcon size={iconSize[props.iconSize || "md"]} />
        )}
        <Container flex="column" gap="4xs">
          {props.label ? (
            <Text size="xs" color="secondaryText">
              {props.label}
            </Text>
          ) : null}
          <Text size={props.textSize || "xs"} color="primaryText">
            {addressOrENS || shortenAddress(props.address)}
          </Text>
          {profile.isLoading ? (
            <Skeleton width="100px" height={fontSize.sm} />
          ) : email || walletInfo?.data?.name ? (
            <Text size="xs" color="secondaryText">
              {email || walletInfo?.data?.name}
            </Text>
          ) : null}
        </Container>
      </Container>
    </Container>
  );
}
