import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { shortenAddress } from "../../../../../../../utils/address.js";
import {
  type fontSize,
  iconSize,
} from "../../../../../../core/design-system/index.js";
import { useConnectedWallets } from "../../../../../../core/hooks/wallets/useConnectedWallets.js";
import { useEnsName } from "../../../../../../core/utils/wallet.js";
import { WalletImage } from "../../../../components/WalletImage.js";
import { Container } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";

export function WalletRow(props: {
  client: ThirdwebClient;
  address: string;
  iconSize?: keyof typeof iconSize;
  textSize?: keyof typeof fontSize;
}) {
  const { client, address } = props;
  const connectedWallets = useConnectedWallets();
  const wallet = connectedWallets.find(
    (w) => w.getAccount()?.address?.toLowerCase() === address.toLowerCase(),
  );
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
        ) : null}
        <Text size={props.textSize || "sm"} color="primaryText">
          {addressOrENS || shortenAddress(props.address)}
        </Text>
      </Container>
    </Container>
  );
}
