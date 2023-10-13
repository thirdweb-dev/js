import type { Chain } from "../src/types";
export default {
  "chain": "TST",
  "chainId": 18,
  "explorers": [
    {
      "name": "thundercore-blockscout-testnet",
      "url": "https://explorer-testnet.thundercore.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet-testnet.thundercore.com"
  ],
  "features": [],
  "infoURL": "https://thundercore.com",
  "name": "ThunderCore Testnet",
  "nativeCurrency": {
    "name": "ThunderCore Testnet Token",
    "symbol": "TST",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://thundercore-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.thundercore.com"
  ],
  "shortName": "TST",
  "slug": "thundercore-testnet",
  "testnet": true
} as const satisfies Chain;