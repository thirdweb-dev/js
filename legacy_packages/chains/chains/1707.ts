import type { Chain } from "../src/types";
export default {
  "chain": "TBSI",
  "chainId": 1707,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://exp.blockchain.or.th",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://blockchain.or.th",
  "name": "TBSI Mainnet",
  "nativeCurrency": {
    "name": "Jinda",
    "symbol": "JINDA",
    "decimals": 18
  },
  "networkId": 1707,
  "rpc": [
    "https://1707.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blockchain.or.th"
  ],
  "shortName": "TBSI",
  "slug": "tbsi",
  "testnet": false,
  "title": "Thai Blockchain Service Infrastructure Mainnet"
} as const satisfies Chain;