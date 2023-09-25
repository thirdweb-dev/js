import type { Chain } from "../src/types";
export default {
  "chainId": 2223,
  "chain": "VChain",
  "name": "VChain Mainnet",
  "rpc": [
    "https://vchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bc.vcex.xyz"
  ],
  "slug": "vchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "VNDT",
    "symbol": "VNDT",
    "decimals": 18
  },
  "infoURL": "https://bo.vcex.xyz/",
  "shortName": "VChain",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "VChain Scan",
      "url": "https://scan.vcex.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;