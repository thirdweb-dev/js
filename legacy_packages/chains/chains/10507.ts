import type { Chain } from "../src/types";
export default {
  "chain": "NUM",
  "chainId": 10507,
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://mainnet.num.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://numbersprotocol.io",
  "name": "Numbers Mainnet",
  "nativeCurrency": {
    "name": "NUM Token",
    "symbol": "NUM",
    "decimals": 18
  },
  "networkId": 10507,
  "rpc": [
    "https://10507.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnetrpc.num.network"
  ],
  "shortName": "Jade",
  "slug": "numbers",
  "testnet": false
} as const satisfies Chain;