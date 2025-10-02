import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import App from "./App.js";
import { config } from "./wagmi.js";

import "./index.css";
import { ThirdwebProvider } from "thirdweb/react";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: always exists
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </ThirdwebProvider>
  </React.StrictMode>,
);
