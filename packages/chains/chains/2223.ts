import type { Chain } from "../src/types";
export default {
  "chain": "VChain",
  "chainId": 2223,
  "explorers": [
    {
      "name": "VChain Scan",
      "url": "https://scan.vcex.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://bo.vcex.xyz/",
  "name": "VChain Mainnet",
  "nativeCurrency": {
    "name": "VNDT",
    "symbol": "VNDT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://vchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bc.vcex.xyz"
  ],
  "shortName": "VChain",
  "slug": "vchain",
  "testnet": false
} as const satisfies Chain;