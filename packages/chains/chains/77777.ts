import type { Chain } from "../src/types";
export default {
  "chain": "Toronet",
  "chainId": 77777,
  "explorers": [
    {
      "name": "toronet_explorer",
      "url": "https://toronet.org/explorer",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmciSvgLatP6jhgdazuiyD3fSrhipfAN7wC943v1qxcrpv",
    "width": 846,
    "height": 733,
    "format": "png"
  },
  "infoURL": "https://toronet.org",
  "name": "Toronet Mainnet",
  "nativeCurrency": {
    "name": "Toro",
    "symbol": "TORO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://toronet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://toronet.org/rpc"
  ],
  "shortName": "Toronet",
  "slug": "toronet",
  "testnet": false
} as const satisfies Chain;