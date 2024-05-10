import type { Chain } from "../src/types";
export default {
  "chain": "MiYou Chain",
  "chainId": 30088,
  "ens": {
    "registry": "0xFEfa9B3061435977424DD947E756566cFB60473E"
  },
  "explorers": [
    {
      "name": "MiYou block explorer",
      "url": "https://myscan.miyou.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmfP1QDK42B7EzYWsYN2PGfjkZUQtSjm1k5gNNT52ixsKL",
    "width": 216,
    "height": 216,
    "format": "png"
  },
  "infoURL": "https://www.miyou.io",
  "name": "MiYou Mainnet",
  "nativeCurrency": {
    "name": "Miyou",
    "symbol": "MY",
    "decimals": 18
  },
  "networkId": 30088,
  "rpc": [
    "https://30088.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://blockchain.miyou.io",
    "https://blockchain.miyoulab.com"
  ],
  "shortName": "MiYou",
  "slip44": 60,
  "slug": "miyou",
  "testnet": false
} as const satisfies Chain;