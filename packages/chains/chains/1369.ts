import type { Chain } from "../src/types";
export default {
  "name": "Zafirium Mainnet",
  "chain": "ZAFIC",
  "icon": {
    "url": "ipfs://QmZT1Wq3P4YbgKBSUmCtgbs5ijPF5d91BzaMPh7Aub8d8t",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "rpc": [
    "https://zafirium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.zakumi.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zakumi Chain Native Token",
    "symbol": "ZAFIC",
    "decimals": 18
  },
  "infoURL": "https://www.zakumi.io",
  "shortName": "zafic",
  "chainId": 1369,
  "networkId": 1369,
  "explorers": [
    {
      "name": "zafirium-explorer",
      "url": "https://explorer.zakumi.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "zafirium"
} as const satisfies Chain;