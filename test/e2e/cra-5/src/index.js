import { ConnectWallet, ThirdwebProvider } from "@thirdweb-dev/react";
import React from "react";
import ReactDOM from "react-dom/client";

const KitchenSink = () => {
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <KitchenSink />
  </React.StrictMode>,
);
