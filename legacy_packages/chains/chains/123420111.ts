import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 123420111,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQXw4QEDR4AbUwX9scH7aGhiSDhQRxu6LCQoUkgsYgGyK/Gelato%20brand%20mark.png",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/op-celestia-testnet",
  "name": "Gelato OP Celestia",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 123420111,
  "redFlags": [],
  "rpc": [],
  "shortName": "opcelestia",
  "slug": "gelato-op-celestia",
  "testnet": true,
  "title": "Gelato OP Celestia Testnet"
} as const satisfies Chain;