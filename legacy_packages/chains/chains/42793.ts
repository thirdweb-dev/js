import type { Chain } from "../src/types";
export default {
  "chain": "Etherlink",
  "chainId": 42793,
  "explorers": [
    {
      "name": "Etherlink Explorer",
      "url": "https://explorer.etherlink.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://etherlink.com",
  "name": "Etherlink Mainnet",
  "nativeCurrency": {
    "name": "tez",
    "symbol": "XTZ",
    "decimals": 18
  },
  "networkId": 42793,
  "rpc": [
    "https://42793.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.mainnet.etherlink.com"
  ],
  "shortName": "etlk",
  "slug": "etherlink",
  "testnet": false
} as const satisfies Chain;