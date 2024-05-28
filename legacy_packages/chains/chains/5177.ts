import type { Chain } from "../src/types";
export default {
  "chain": "TLC",
  "chainId": 5177,
  "explorers": [
    {
      "name": "TLChain Explorer",
      "url": "https://explorer.tlchain.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://tlchain.network/",
  "name": "TLChain Network Mainnet",
  "nativeCurrency": {
    "name": "TLChain Network",
    "symbol": "TLC",
    "decimals": 18
  },
  "networkId": 5177,
  "rpc": [
    "https://5177.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tlxscan.com/"
  ],
  "shortName": "tlc",
  "slug": "tlchain-network",
  "testnet": false
} as const satisfies Chain;