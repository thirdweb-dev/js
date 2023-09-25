import type { Chain } from "../src/types";
export default {
  "chainId": 77777,
  "chain": "Toronet",
  "name": "Toronet Mainnet",
  "rpc": [
    "https://toronet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://toronet.org/rpc"
  ],
  "slug": "toronet",
  "icon": {
    "url": "ipfs://QmciSvgLatP6jhgdazuiyD3fSrhipfAN7wC943v1qxcrpv",
    "width": 846,
    "height": 733,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Toro",
    "symbol": "TORO",
    "decimals": 18
  },
  "infoURL": "https://toronet.org",
  "shortName": "Toronet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "toronet_explorer",
      "url": "https://toronet.org/explorer",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;