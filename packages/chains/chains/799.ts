import type { Chain } from "../src/types";
export default {
  "chain": "Rupaya Testnet",
  "chainId": 799,
  "explorers": [
    {
      "name": "rupayascan",
      "url": "https://scan.testnet.rupaya.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.testnet.rupaya.io"
  ],
  "infoURL": "https://www.rupaya.io",
  "name": "Rupaya Testnet",
  "nativeCurrency": {
    "name": "Test Rupaya",
    "symbol": "TRUPX",
    "decimals": 18
  },
  "networkId": 799,
  "rpc": [
    "https://799.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.rupaya.io"
  ],
  "shortName": "RupayaTestnet",
  "slip44": 1,
  "slug": "rupaya-testnet",
  "testnet": true
} as const satisfies Chain;