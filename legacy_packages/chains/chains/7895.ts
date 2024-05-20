import type { Chain } from "../src/types";
export default {
  "chain": "ATHENA",
  "chainId": 7895,
  "explorers": [
    {
      "name": "ARDENIUM Athena Explorer",
      "url": "https://testnet.ardscan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet-athena.ardescan.com/"
  ],
  "infoURL": "https://ardenium.org",
  "name": "ARDENIUM Athena",
  "nativeCurrency": {
    "name": "ARD",
    "symbol": "tARD",
    "decimals": 18
  },
  "networkId": 7895,
  "rpc": [
    "https://7895.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-athena.ardescan.com/"
  ],
  "shortName": "ard",
  "slug": "ardenium-athena",
  "testnet": true
} as const satisfies Chain;