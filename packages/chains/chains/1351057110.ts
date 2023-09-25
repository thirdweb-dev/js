import type { Chain } from "../src/types";
export default {
  "chainId": 1351057110,
  "chain": "staging-fast-active-bellatrix",
  "name": "Chaos (SKALE Testnet)",
  "rpc": [
    "https://chaos-skale-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix"
  ],
  "slug": "chaos-skale-testnet",
  "faucets": [
    "https://sfuel.skale.network/staging/chaos"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://docs.skale.network/develop/",
  "shortName": "chaos-tenet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;