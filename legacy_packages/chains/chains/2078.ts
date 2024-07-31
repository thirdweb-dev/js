import type { Chain } from "../src/types";
export default {
  "chain": "Parodychain",
  "chainId": 2078,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmR2ovc7zeM7gdzpL6FdvWBEhLyE8dL1w8GWnooHEk9uEZ/parodychain-logo.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "Parody Network",
  "nativeCurrency": {
    "name": "Parody",
    "symbol": "PDY",
    "decimals": 18
  },
  "networkId": 2078,
  "redFlags": [],
  "rpc": [
    "https://2078.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-flashbox-4392-rpc.a.stagenet.tanssi.network"
  ],
  "shortName": "Parody",
  "slug": "parody-network",
  "testnet": true
} as const satisfies Chain;