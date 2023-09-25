import type { Chain } from "../src/types";
export default {
  "chainId": 54321,
  "chain": "Toronet",
  "name": "Toronet Testnet",
  "rpc": [
    "https://toronet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.toronet.org/rpc"
  ],
  "slug": "toronet-testnet",
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
  "shortName": "ToronetTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "toronet_explorer",
      "url": "https://testnet.toronet.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;