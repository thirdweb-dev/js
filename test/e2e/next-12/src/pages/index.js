import { ConnectWallet, ThirdwebProvider } from "@thirdweb-dev/react";

export const KitchenSink = () => {
  return (
    <ThirdwebProvider>
      <WrappedKitchenSink />
    </ThirdwebProvider>
  );
};

const WrappedKitchenSink = () => {
  return (
    <div id="kitchen-sink">
      <ConnectWallet />
    </div>
  );
};

export default function Home() {
  return <KitchenSink />;
}
