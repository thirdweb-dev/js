import type { Chain } from "../types";
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
  "infoURL": "https://bo.vcex.xyz/",
  "name": "VChain Mainnet",
  "nativeCurrency": {
    "name": "VNDT",
    "symbol": "VNDT",
    "decimals": 18
  },
  "networkId": 2223,
  "rpc": [
    "https://vchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2223.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bc.vcex.xyz"
  ],
  "shortName": "VChain",
  "slug": "vchain",
  "testnet": false
} as const satisfies Chain;