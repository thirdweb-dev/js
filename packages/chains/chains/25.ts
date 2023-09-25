import type { Chain } from "../src/types";
export default {
  "chainId": 25,
  "chain": "CRO",
  "name": "Cronos Mainnet",
  "rpc": [
    "https://cronos.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.cronos.org",
    "https://cronos-evm.publicnode.com",
    "wss://cronos-evm.publicnode.com"
  ],
  "slug": "cronos",
  "faucets": [],
  "nativeCurrency": {
    "name": "Cronos",
    "symbol": "CRO",
    "decimals": 18
  },
  "infoURL": "https://cronos.org/",
  "shortName": "cro",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Cronos Explorer",
      "url": "https://cronoscan.com",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;