import type { Client, Provider, WebSocketProvider } from "@wagmi/core";

export let client: Client<Provider, WebSocketProvider>;

export function getClient<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
>() {
  if (!client) {
    throw new Error(
      "No wagmi client found. Ensure you have set up a client: https://wagmi.sh/react/client",
    );
  }
  return client as unknown as Client<TProvider, TWebSocketProvider>;
}
