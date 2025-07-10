export const embedCode = (clientId: string) => `\
import { createThirdwebClient } from "thirdweb";
import { BuyWidget } from "thirdweb/react";
import { ethereum } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: "${clientId}",
});

export default function App() {
  return (
    <BuyWidget
      client={client}
      chain={ethereum}
      amount="0.1"
    />
  );
}`;

export const sdkCode = (clientId: string) => `\
import { Bridge, NATIVE_TOKEN_ADDRESS, createThirdwebClient, toWei } from "thirdweb";

const client = createThirdwebClient({
  clientId: "${clientId}",
});

const quote = await Bridge.Buy.prepare({
  originChainId: 1,
  originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  destinationChainId: 10,
  destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  amount: toWei("0.01"),
  sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
  receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
  client,
});`;

export const apiCode = (clientId: string) => `\
curl -X POST https://pay.thirdweb.com/v1/buy/prepare
  -H "Content-Type: application/json"
  -H "x-client-id: ${clientId}"
  -d '{"originChainId":"1","originTokenAddress":"0x...","destinationChainId":"10","destinationTokenAddress":"0x...","amount":"0.01"}'`;
