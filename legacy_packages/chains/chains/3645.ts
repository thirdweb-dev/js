import type { Chain } from "../src/types";
export default {
  "chain": "iChain Testnet",
  "chainId": 3645,
  "explorers": [
    {
      "name": "iChainscan",
      "url": "https://test.ichainscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcumhDxUyoLTHkcMKgPqkpGnnjwSTqE2KGFnDXXFY8mMo",
    "width": 40,
    "height": 38,
    "format": "png"
  },
  "infoURL": "https://islamicoin.finance",
  "name": "iChain Testnet",
  "nativeCurrency": {
    "name": "ISLAMICOIN",
    "symbol": "ISLAMI",
    "decimals": 18
  },
  "networkId": 3645,
  "rpc": [
    "https://3645.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://istanbul.ichainscan.com"
  ],
  "shortName": "ISLAMIT",
  "slug": "ichain-testnet",
  "testnet": true
} as const satisfies Chain;