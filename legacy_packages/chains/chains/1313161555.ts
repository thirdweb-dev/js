import type { Chain } from "../src/types";
export default {
  "chain": "NEAR",
  "chainId": 1313161555,
  "explorers": [
    {
      "name": "aurorascan.dev",
      "url": "https://testnet.aurorascan.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://aurora.dev",
  "name": "Aurora Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1313161555,
  "rpc": [
    "https://1313161555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.aurora.dev/",
    "https://aurora-testnet.drpc.org",
    "wss://aurora-testnet.drpc.org"
  ],
  "shortName": "aurora-testnet",
  "slip44": 1,
  "slug": "aurora-testnet",
  "testnet": true
} as const satisfies Chain;