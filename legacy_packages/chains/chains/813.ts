import type { Chain } from "../src/types";
export default {
  "chain": "MEER",
  "chainId": 813,
  "explorers": [
    {
      "name": "meerscan",
      "url": "https://qng.qitmeer.io",
      "standard": "EIP3091"
    },
    {
      "name": "meerscan",
      "url": "https://qng.meerscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://github.com/Qitmeer",
  "name": "Qitmeer Network Mainnet",
  "nativeCurrency": {
    "name": "Qitmeer",
    "symbol": "MEER",
    "decimals": 18
  },
  "networkId": 813,
  "rpc": [
    "https://813.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-dataseed1.meerscan.io",
    "https://evm-dataseed2.meerscan.io",
    "https://evm-dataseed3.meerscan.io",
    "https://evm-dataseed.meerscan.com",
    "https://qng.rpc.qitmeer.io",
    "https://mainnet.meerlabs.com",
    "https://rpc.dimai.ai",
    "https://rpc.woowow.io"
  ],
  "shortName": "meer",
  "slip44": 813,
  "slug": "qitmeer-network",
  "testnet": false
} as const satisfies Chain;