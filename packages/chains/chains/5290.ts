import type { Chain } from "../src/types";
export default {
  "chain": "FIRE",
  "chainId": 5290,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYjuztyURb3Fc6ZTLgCbwQa64CcVoigF5j9cafzuSbqgf",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://thefirechain.com",
  "name": "Firechain Mainnet Old",
  "nativeCurrency": {
    "name": "Firechain",
    "symbol": "FIRE",
    "decimals": 18
  },
  "networkId": 5290,
  "rpc": [
    "https://firechain-old.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5290.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.rpc1.thefirechain.com"
  ],
  "shortName": "_old_fire",
  "slug": "firechain-old",
  "status": "deprecated",
  "testnet": false
} as const satisfies Chain;