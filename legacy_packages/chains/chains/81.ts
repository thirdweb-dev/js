import type { Chain } from "../src/types";
export default {
  "chain": "JOC",
  "chainId": 81,
  "explorers": [
    {
      "name": "Block Explorer",
      "url": "https://explorer.japanopenchain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.japanopenchain.org/",
  "name": "Japan Open Chain Mainnet",
  "nativeCurrency": {
    "name": "Japan Open Chain Token",
    "symbol": "JOC",
    "decimals": 18
  },
  "networkId": 81,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://81.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-1.japanopenchain.org:8545",
    "https://rpc-2.japanopenchain.org:8545"
  ],
  "shortName": "joc",
  "slug": "japan-open-chain",
  "testnet": false
} as const satisfies Chain;