import type { Chain } from "../src/types";
export default {
  "chain": "NFIC",
  "chainId": 132,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://namefi.io/",
  "name": "Namefi Chain Mainnet",
  "nativeCurrency": {
    "name": "Namefi Coin",
    "symbol": "NFIC",
    "decimals": 18
  },
  "networkId": 132,
  "rpc": [
    "https://132.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chain.namefi.io"
  ],
  "shortName": "nfic",
  "slug": "namefi-chain",
  "testnet": false
} as const satisfies Chain;