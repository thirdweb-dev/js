import type { Chain } from "../src/types";
export default {
  "chain": "TENET",
  "chainId": 155,
  "explorers": [
    {
      "name": "TenetScan Testnet",
      "url": "https://testnet.tenetscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.testnet.tenet.org"
  ],
  "infoURL": "https://tenet.org/",
  "name": "Tenet Testnet",
  "nativeCurrency": {
    "name": "TENET",
    "symbol": "TENET",
    "decimals": 18
  },
  "networkId": 155,
  "rpc": [
    "https://155.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tenet.org"
  ],
  "shortName": "tenet-testnet",
  "slip44": 1,
  "slug": "tenet-testnet",
  "testnet": true,
  "title": "Tenet Testnet"
} as const satisfies Chain;