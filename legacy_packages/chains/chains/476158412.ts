import type { Chain } from "../src/types";
export default {
  "chain": "staging-legal-crazy-castor",
  "chainId": 476158412,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev/staging"
  ],
  "infoURL": "https://europahub.network/",
  "name": "Deprecated SKALE Europa Hub Testnet",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 476158412,
  "rpc": [
    "https://476158412.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor"
  ],
  "shortName": "deprecated-europa-testnet",
  "slip44": 1,
  "slug": "deprecated-skale-europa-hub-testnet",
  "status": "deprecated",
  "testnet": true,
  "title": "Deprecated Europa Hub Testnet"
} as const satisfies Chain;