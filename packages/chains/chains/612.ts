import type { Chain } from "../src/types";
export default {
  "chain": "EIOB",
  "chainId": 612,
  "explorers": [
    {
      "name": "EIOB Explorer",
      "url": "https://explorer.eiob.xyz",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfJLG2mXgSqKx2V3A2jzTwt4vkozvQTTXkRy3os27wEVm",
    "width": 48,
    "height": 48,
    "format": "png"
  },
  "name": "EIOB Mainnet",
  "nativeCurrency": {
    "name": "EIOB",
    "symbol": "EIOB",
    "decimals": 18
  },
  "networkId": 612,
  "rpc": [
    "https://612.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.eiob.xyz"
  ],
  "shortName": "eiob",
  "slug": "eiob",
  "testnet": false
} as const satisfies Chain;