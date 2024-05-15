import type { Chain } from "../src/types";
export default {
  "chain": "UPBEth",
  "chainId": 1918,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://mobylab.docs.crescdi.pub.ro/blog/UPB-CRESCDI-Testnet",
  "name": "UPB CRESCDI Testnet",
  "nativeCurrency": {
    "name": "UPBEth",
    "symbol": "UPBEth",
    "decimals": 18
  },
  "networkId": 1918,
  "rpc": [
    "https://1918.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.crescdi.pub.ro"
  ],
  "shortName": "UPBEth",
  "slug": "upb-crescdi-testnet",
  "testnet": true
} as const satisfies Chain;