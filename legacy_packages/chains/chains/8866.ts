import type { Chain } from "../src/types";
export default {
  "chain": "SuperLumio",
  "chainId": 8866,
  "explorers": [
    {
      "name": "Lumio explorer",
      "url": "https://explorer.lumio.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXiatdz5WBFypfsudoDsFnsLdiHzDwcD3pWcHwBovbPiZ",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://lumio.io/",
  "name": "SuperLumio",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 8866,
  "rpc": [
    "https://8866.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.lumio.io/"
  ],
  "shortName": "superlumio",
  "slug": "superlumio",
  "testnet": false
} as const satisfies Chain;