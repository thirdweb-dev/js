import type { Chain } from "../src/types";
export default {
  "chain": "Canto",
  "chainId": 7700,
  "explorers": [
    {
      "name": "Canto Explorer (OKLink)",
      "url": "https://www.oklink.com/canto",
      "standard": "EIP3091"
    },
    {
      "name": "Canto EVM Explorer (Blockscout)",
      "url": "https://tuber.build",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://canto.dex.guru",
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
  "name": "Canto",
  "nativeCurrency": {
    "name": "Canto",
    "symbol": "CANTO",
    "decimals": 18
  },
  "networkId": 7700,
  "rpc": [
    "https://7700.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://canto.slingshot.finance",
    "https://canto-rpc.ansybl.io",
    "https://mainnode.plexnode.org:8545",
    "https://canto.gravitychain.io/"
  ],
  "shortName": "canto",
  "slug": "canto",
  "testnet": false
} as const satisfies Chain;