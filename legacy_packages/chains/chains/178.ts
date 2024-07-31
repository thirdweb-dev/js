import type { Chain } from "../src/types";
export default {
  "chain": "ABEY",
  "chainId": 178,
  "explorers": [
    {
      "name": "abeyscan-testnet",
      "url": "https://testnet.abeyscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://testnet-faucet.abeychain.com"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://abey.com",
  "name": "ABEY Testnet",
  "nativeCurrency": {
    "name": "ABEY",
    "symbol": "tABEY",
    "decimals": 18
  },
  "networkId": 178,
  "rpc": [
    "https://178.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.abeychain.com"
  ],
  "shortName": "abeyt",
  "slug": "abey-testnet",
  "testnet": true
} as const satisfies Chain;