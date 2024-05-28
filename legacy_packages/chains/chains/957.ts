import type { Chain } from "../src/types";
export default {
  "chain": "Lyra",
  "chainId": 957,
  "explorers": [
    {
      "name": "Lyra Explorer",
      "url": "https://explorer.lyra.finance",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://lyra.finance",
  "name": "Lyra Chain",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 957,
  "rpc": [
    "https://957.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lyra.finance"
  ],
  "shortName": "lyra",
  "slug": "lyra-chain",
  "testnet": false
} as const satisfies Chain;