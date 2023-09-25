import type { Chain } from "../src/types";
export default {
  "chainId": 126,
  "chain": "OYchain",
  "name": "OYchain Mainnet",
  "rpc": [
    "https://oychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.oychain.io"
  ],
  "slug": "oychain",
  "icon": {
    "url": "ipfs://QmXW5T2MaGHznXUmQEXoyJjcdmX7dhLbj5fnqvZZKqeKzA",
    "width": 677,
    "height": 237,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OYchain Token",
    "symbol": "OY",
    "decimals": 18
  },
  "infoURL": "https://www.oychain.io",
  "shortName": "OYchainMainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "OYchain Mainnet Explorer",
      "url": "https://explorer.oychain.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;