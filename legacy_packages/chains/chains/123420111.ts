import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 123420111,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://opcelestia-raspberry.gelatoscout.com",
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
  "infoURL": "https://raas.gelato.network/rollups/details/public/opcelestia-raspberry",
  "name": "OP Celestia Rasberry",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 123420111,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/opcelestia-raspberry"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://123420111.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.opcelestia-raspberry.gelato.digital",
    "wss://ws.opcelestia-raspberry.gelato.digital"
  ],
  "shortName": "opcelestia-rasberry",
  "slip44": 60,
  "slug": "op-celestia-rasberry",
  "status": "active",
  "testnet": true,
  "title": "OP Celestia Rasberry"
} as const satisfies Chain;