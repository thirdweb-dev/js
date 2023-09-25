import type { Chain } from "../src/types";
export default {
  "chainId": 18,
  "chain": "TST",
  "name": "ThunderCore Testnet",
  "rpc": [
    "https://thundercore-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.thundercore.com"
  ],
  "slug": "thundercore-testnet",
  "faucets": [
    "https://faucet-testnet.thundercore.com"
  ],
  "nativeCurrency": {
    "name": "ThunderCore Testnet Token",
    "symbol": "TST",
    "decimals": 18
  },
  "infoURL": "https://thundercore.com",
  "shortName": "TST",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "thundercore-blockscout-testnet",
      "url": "https://explorer-testnet.thundercore.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;