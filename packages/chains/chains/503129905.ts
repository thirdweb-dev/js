import type { Chain } from "../src/types";
export default {
  "chainId": 503129905,
  "chain": "staging-faint-slimy-achird",
  "name": "Nebula Staging",
  "rpc": [
    "https://nebula-staging.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird",
    "wss://staging-v3.skalenodes.com/v1/ws/staging-faint-slimy-achird"
  ],
  "slug": "nebula-staging",
  "faucets": [],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://nebulachain.io/",
  "shortName": "nebula-staging",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "nebula",
      "url": "https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;