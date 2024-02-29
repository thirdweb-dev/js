import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 2662,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTYgeN1E3GGXnMF2oa43v2ehX2bYqrHPrGQ9xbBMXy1we",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "infoURL": "https://apexlayer.xyz/",
  "name": "APEX",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2662,
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "rpc": [],
  "shortName": "apexmainnet",
  "slug": "apex",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;