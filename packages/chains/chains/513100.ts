import type { Chain } from "../src/types";
export default {
  "chain": "DIS",
  "chainId": 513100,
  "explorers": [
    {
      "name": "DisChain",
      "url": "https://www.oklink.com/dis",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://dischain.xyz",
  "name": "DisChain",
  "nativeCurrency": {
    "name": "DisChain",
    "symbol": "DIS",
    "decimals": 18
  },
  "networkId": 513100,
  "rpc": [
    "https://513100.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dischain.xyz"
  ],
  "shortName": "dis",
  "slug": "dischain",
  "testnet": false
} as const satisfies Chain;