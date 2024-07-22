import type { Chain } from "../src/types";
export default {
  "chain": "VCITY",
  "chainId": 20230825,
  "explorers": [
    {
      "name": "Vcity Explorer",
      "url": "https://scan.vcity.app",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://vcity.app",
  "name": "Vcity Testnet",
  "nativeCurrency": {
    "name": "Testnet Vcity Token",
    "symbol": "VCITY",
    "decimals": 18
  },
  "networkId": 20230825,
  "rpc": [
    "https://20230825.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.vcity.app"
  ],
  "shortName": "Vcity",
  "slug": "vcity-testnet",
  "testnet": true
} as const satisfies Chain;