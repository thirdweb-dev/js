import type { Chain } from "../src/types";
export default {
  "name": "Canto Tesnet",
  "chain": "Canto",
  "rpc": [
    "https://canto-tesnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-archive.plexnode.wtf"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Testnet Canto",
    "symbol": "CANTO",
    "decimals": 18
  },
  "infoURL": "https://canto.io",
  "shortName": "TestnetCanto",
  "chainId": 7701,
  "networkId": 7701,
  "explorers": [
    {
      "name": "Canto Testnet EVM Explorer (Blockscout)",
      "url": "https://testnet.tuber.build",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "canto-tesnet"
} as const satisfies Chain;