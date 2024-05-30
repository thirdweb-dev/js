import type { Chain } from "../src/types";
export default {
  "chain": "CONET",
  "chainId": 224422,
  "explorers": [
    {
      "name": "CONET Scan",
      "url": "https://scan.conet.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://conet.network",
  "name": "CONET Sebolia Testnet",
  "nativeCurrency": {
    "name": "CONET Sebolia",
    "symbol": "CONET",
    "decimals": 18
  },
  "networkId": 224422,
  "rpc": [
    "https://224422.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.conet.network"
  ],
  "shortName": "conet-sebolia",
  "slip44": 1,
  "slug": "conet-sebolia-testnet",
  "testnet": true
} as const satisfies Chain;