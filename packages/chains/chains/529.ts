import type { Chain } from "../src/types";
export default {
  "chainId": 529,
  "chain": "FIRE",
  "name": "Firechain Mainnet",
  "rpc": [
    "https://firechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.rpc1.thefirechain.com"
  ],
  "slug": "firechain",
  "icon": {
    "url": "ipfs://QmYjuztyURb3Fc6ZTLgCbwQa64CcVoigF5j9cafzuSbqgf",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Firechain",
    "symbol": "FIRE",
    "decimals": 18
  },
  "infoURL": "https://thefirechain.com",
  "shortName": "fire",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;