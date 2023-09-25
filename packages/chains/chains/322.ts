import type { Chain } from "../src/types";
export default {
  "chainId": 322,
  "chain": "KCC",
  "name": "KCC Testnet",
  "rpc": [
    "https://kcc-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.kcc.network"
  ],
  "slug": "kcc-testnet",
  "faucets": [
    "https://faucet-testnet.kcc.network"
  ],
  "nativeCurrency": {
    "name": "KuCoin Testnet Token",
    "symbol": "tKCS",
    "decimals": 18
  },
  "infoURL": "https://scan-testnet.kcc.network",
  "shortName": "kcst",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "kcc-scan-testnet",
      "url": "https://scan-testnet.kcc.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;