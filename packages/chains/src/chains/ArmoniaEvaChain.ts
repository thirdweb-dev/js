import type { Chain } from "../types";
export default {
  "chain": "Eva",
  "chainId": 160,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://amax.network",
  "name": "Armonia Eva Chain Mainnet",
  "nativeCurrency": {
    "name": "Armonia Multichain Native Token",
    "symbol": "AMAX",
    "decimals": 18
  },
  "networkId": 160,
  "rpc": [
    "https://armonia-eva-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://160.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evascan.io/api/eth-rpc/"
  ],
  "shortName": "eva",
  "slug": "armonia-eva-chain",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;