import type { Chain } from "../src/types";
export default {
  "chain": "MEER",
  "chainId": 8131,
  "explorers": [
    {
      "name": "meerscan testnet",
      "url": "https://testnet-qng.qitmeer.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.qitmeer.io"
  ],
  "infoURL": "https://github.com/Qitmeer",
  "name": "Qitmeer Network Testnet",
  "nativeCurrency": {
    "name": "Qitmeer Testnet",
    "symbol": "MEER-T",
    "decimals": 18
  },
  "networkId": 8131,
  "rpc": [
    "https://8131.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-qng.rpc.qitmeer.io",
    "https://testnet.meerlabs.com",
    "https://meer.testnet.meerfans.club"
  ],
  "shortName": "meertest",
  "slip44": 1,
  "slug": "qitmeer-network-testnet",
  "testnet": true
} as const satisfies Chain;