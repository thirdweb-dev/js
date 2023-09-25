import type { Chain } from "../src/types";
export default {
  "chainId": 1369,
  "chain": "ZAFIC",
  "name": "Zafirium Mainnet",
  "rpc": [
    "https://zafirium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.zakumi.io"
  ],
  "slug": "zafirium",
  "icon": {
    "url": "ipfs://QmZT1Wq3P4YbgKBSUmCtgbs5ijPF5d91BzaMPh7Aub8d8t",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Zakumi Chain Native Token",
    "symbol": "ZAFIC",
    "decimals": 18
  },
  "infoURL": "https://www.zakumi.io",
  "shortName": "zafic",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "zafirium-explorer",
      "url": "https://explorer.zakumi.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;