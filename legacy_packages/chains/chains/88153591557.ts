import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 88153591557,
  "explorers": [],
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
  "redFlags": [],
  "rpc": [],
  "shortName": "arb-blueberry",
  "slug": "arbitrum-blueberry",
  "testnet": true,
  "title": "Arbitrum Blueberry"
} as const satisfies Chain;