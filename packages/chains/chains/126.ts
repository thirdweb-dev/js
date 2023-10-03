import type { Chain } from "../src/types";
export default {
  "chain": "OYchain",
  "chainId": 126,
  "explorers": [
    {
      "name": "OYchain Mainnet Explorer",
      "url": "https://explorer.oychain.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmXW5T2MaGHznXUmQEXoyJjcdmX7dhLbj5fnqvZZKqeKzA",
    "width": 677,
    "height": 237,
    "format": "png"
  },
  "infoURL": "https://www.oychain.io",
  "name": "OYchain Mainnet",
  "nativeCurrency": {
    "name": "OYchain Token",
    "symbol": "OY",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://oychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.oychain.io"
  ],
  "shortName": "OYchainMainnet",
  "slug": "oychain",
  "testnet": false
} as const satisfies Chain;