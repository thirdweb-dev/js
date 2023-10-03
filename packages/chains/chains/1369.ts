import type { Chain } from "../src/types";
export default {
  "chain": "ZAFIC",
  "chainId": 1369,
  "explorers": [
    {
      "name": "zafirium-explorer",
      "url": "https://explorer.zakumi.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZT1Wq3P4YbgKBSUmCtgbs5ijPF5d91BzaMPh7Aub8d8t",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "infoURL": "https://www.zakumi.io",
  "name": "Zafirium Mainnet",
  "nativeCurrency": {
    "name": "Zakumi Chain Native Token",
    "symbol": "ZAFIC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://zafirium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.zakumi.io"
  ],
  "shortName": "zafic",
  "slug": "zafirium",
  "testnet": false
} as const satisfies Chain;