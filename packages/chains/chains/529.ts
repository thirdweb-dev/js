import type { Chain } from "../src/types";
export default {
  "chain": "FIRE",
  "chainId": 529,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmYjuztyURb3Fc6ZTLgCbwQa64CcVoigF5j9cafzuSbqgf",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://thefirechain.com",
  "name": "Firechain Mainnet",
  "nativeCurrency": {
    "name": "Firechain",
    "symbol": "FIRE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://firechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.rpc1.thefirechain.com"
  ],
  "shortName": "fire",
  "slug": "firechain",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;