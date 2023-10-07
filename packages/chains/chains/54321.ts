import type { Chain } from "../src/types";
export default {
  "chain": "Toronet",
  "chainId": 54321,
  "explorers": [
    {
      "name": "toronet_explorer",
      "url": "https://testnet.toronet.org",
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
  "name": "Toronet Testnet",
  "nativeCurrency": {
    "name": "Toro",
    "symbol": "TORO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://toronet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.toronet.org/rpc"
  ],
  "shortName": "ToronetTestnet",
  "slug": "toronet-testnet",
  "testnet": true
} as const satisfies Chain;