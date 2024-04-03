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
  "infoURL": "https://raas.gelato.network/rollups/details/public/opcelestia-raspberry",
  "name": "OP Celestia Rasberry",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 123420111,
  "redFlags": [],
  "rpc": [],
  "shortName": "opcelestia-rasberry",
  "slug": "op-celestia-rasberry",
  "testnet": true,
  "title": "OP Celestia Rasberry"
} as const satisfies Chain;