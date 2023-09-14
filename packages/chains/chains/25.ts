import type { Chain } from "../src/types";
export default {
  "name": "Cronos Mainnet",
  "chain": "CRO",
  "rpc": [
    "https://cronos.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.cronos.org",
    "https://cronos-evm.publicnode.com",
    "wss://cronos-evm.publicnode.com"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Cronos",
    "symbol": "CRO",
    "decimals": 18
  },
  "infoURL": "https://cronos.org/",
  "shortName": "cro",
  "chainId": 25,
  "networkId": 25,
  "explorers": [
    {
      "name": "Cronos Explorer",
      "url": "https://cronoscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "cronos"
} as const satisfies Chain;