import type { ThirdwebContract } from "thirdweb";
import { getAuthTokenWalletAddress } from "../../../../../../api/lib/getAuthToken";
import { PublishedByUI, getPublishedByCardProps } from "./published-by-ui";

interface PublishedByProps {
  contract: ThirdwebContract;
}

export const PublishedBy: React.FC<PublishedByProps> = async ({ contract }) => {
  const address = await getAuthTokenWalletAddress();
  const props = await getPublishedByCardProps({
    address,
    contract,
    client: contract.client,
  });

  if (!props) {
    return null;
  }

  return (
    <PublishedByUI
      isBeta={props.isBeta}
      modules={props.modules}
      name={props.name}
      publisher={props.publisher}
      version={props.version}
      client={contract.client}
    />
  );
};
