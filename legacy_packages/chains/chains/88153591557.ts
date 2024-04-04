import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 88153591557,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://arb-blueberry.gelatoscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQXw4QEDR4AbUwX9scH7aGhiSDhQRxu6LCQoUkgsYgGyK/Gelato%20brand%20mark.png",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/arb-blueberry",
  "name": "Arbitrum Blueberry",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 88153591557,
  "parent": {
    "type": "L2",
    "chain": "eip155-421614",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/arb-blueberry"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://88153591557.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.arb-blueberry.gelato.digital",
    "wss://ws.arb-blueberry.gelato.digital"
  ],
  "shortName": "arb-blueberry",
  "slip44": 60,
  "slug": "arbitrum-blueberry",
  "status": "active",
  "testnet": true,
  "title": "Arbitrum Blueberry"
} as const satisfies Chain;