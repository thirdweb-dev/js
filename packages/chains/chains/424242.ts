import type { Chain } from "../src/types";
export default {
  "chainId": 424242,
  "chain": "FTN",
  "name": "Fastex Chain testnet",
  "rpc": [
    "https://fastex-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.fastexchain.com"
  ],
  "slug": "fastex-chain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "FTN",
    "symbol": "FTN",
    "decimals": 18
  },
  "infoURL": "https://fastex.com",
  "shortName": "fastexTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.ftnscan.com",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;