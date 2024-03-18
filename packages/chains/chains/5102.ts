import type { Chain } from "../src/types";
export default {
  "chain": "SIC Testnet",
  "chainId": 5102,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorerl2new-sic-testnet-zvr7tlkzsi.t.conduit.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.fwb.help/",
  "name": "SIC Testnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 5102,
  "rpc": [
    "https://5102.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-sic-testnet-zvr7tlkzsi.t.conduit.xyz"
  ],
  "shortName": "sic-testnet",
  "slug": "sic-testnet",
  "testnet": true
} as const satisfies Chain;