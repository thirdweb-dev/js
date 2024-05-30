import type { Chain } from "../src/types";
export default {
  "chain": "SaitaBlockChain(SBC)",
  "chainId": 1209,
  "explorers": [
    {
      "name": "Saitascan explorer",
      "url": "https://saitascan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://saitachain.com",
  "name": "SaitaBlockChain(SBC)",
  "nativeCurrency": {
    "name": "SaitaBlockChain(SBC)",
    "symbol": "STC",
    "decimals": 18
  },
  "networkId": 1209,
  "rpc": [
    "https://1209.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-nodes.saitascan.io"
  ],
  "shortName": "SBC",
  "slug": "saitablockchain-sbc",
  "testnet": false
} as const satisfies Chain;