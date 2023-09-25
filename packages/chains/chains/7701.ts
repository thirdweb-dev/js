import type { Chain } from "../src/types";
export default {
  "chainId": 7701,
  "chain": "Canto",
  "name": "Canto Tesnet",
  "rpc": [
    "https://canto-tesnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-archive.plexnode.wtf"
  ],
  "slug": "canto-tesnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Testnet Canto",
    "symbol": "CANTO",
    "decimals": 18
  },
  "infoURL": "https://canto.io",
  "shortName": "TestnetCanto",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Canto Testnet EVM Explorer (Blockscout)",
      "url": "https://testnet.tuber.build",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;