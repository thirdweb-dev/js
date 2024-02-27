import type { Chain } from "../src/types";
export default {
  "chain": "Canto",
  "chainId": 7701,
  "explorers": [
    {
      "name": "Canto Testnet EVM Explorer (Blockscout)",
      "url": "https://testnet.tuber.build",
      "standard": "none"
    },
    {
      "name": "dexguru",
      "url": "https://canto-test.dex.guru",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRaASKRSjQ5btoUQ2rNTJNxKtx2a2RoewgA7DMQkLVEne",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "infoURL": "https://canto.io",
  "name": "Canto Tesnet",
  "nativeCurrency": {
    "name": "Testnet Canto",
    "symbol": "CANTO",
    "decimals": 18
  },
  "networkId": 7701,
  "rpc": [
    "https://7701.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-archive.plexnode.wtf"
  ],
  "shortName": "TestnetCanto",
  "slip44": 1,
  "slug": "canto-tesnet",
  "testnet": true
} as const satisfies Chain;