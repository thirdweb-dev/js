import type { Chain } from "../src/types";
export default {
  "chainId": 160,
  "chain": "Eva",
  "name": "Armonia Eva Chain Mainnet",
  "rpc": [
    "https://armonia-eva-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evascan.io/api/eth-rpc/"
  ],
  "slug": "armonia-eva-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Armonia Multichain Native Token",
    "symbol": "AMAX",
    "decimals": 18
  },
  "infoURL": "https://amax.network",
  "shortName": "eva",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;