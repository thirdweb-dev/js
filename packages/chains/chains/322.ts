import type { Chain } from "../src/types";
export default {
  "chain": "KCC",
  "chainId": 322,
  "explorers": [
    {
      "name": "kcc-scan-testnet",
      "url": "https://scan-testnet.kcc.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet-testnet.kcc.network"
  ],
  "infoURL": "https://scan-testnet.kcc.network",
  "name": "KCC Testnet",
  "nativeCurrency": {
    "name": "KuCoin Testnet Token",
    "symbol": "tKCS",
    "decimals": 18
  },
  "networkId": 322,
  "rpc": [
    "https://kcc-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://322.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.kcc.network"
  ],
  "shortName": "kcst",
  "slip44": 1,
  "slug": "kcc-testnet",
  "testnet": true
} as const satisfies Chain;