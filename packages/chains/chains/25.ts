import type { Chain } from "../src/types";
export default {
  "chain": "CRO",
  "chainId": 25,
  "explorers": [
    {
      "name": "Cronos Explorer",
      "url": "https://explorer.cronos.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://cronos.org/",
  "name": "Cronos Mainnet",
  "nativeCurrency": {
    "name": "Cronos",
    "symbol": "CRO",
    "decimals": 18
  },
  "networkId": 25,
  "rpc": [
    "https://25.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.cronos.org",
    "https://cronos-evm-rpc.publicnode.com",
    "wss://cronos-evm-rpc.publicnode.com"
  ],
  "shortName": "cro",
  "slug": "cronos",
  "testnet": false
} as const satisfies Chain;