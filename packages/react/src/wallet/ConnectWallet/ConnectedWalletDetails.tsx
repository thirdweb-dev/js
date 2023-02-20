import { Button } from "../../components/buttons";
import { useDisconnect } from "@thirdweb-dev/react-core";

export const ConnectedWalletDetails = () => {
  const disconnect = useDisconnect();
  return (
    <Button variant="inverted" onClick={disconnect}>
      Disconnect
    </Button>
  );
};
