import type { Chain } from "../src/types";
export default {
  "chainId": 84886,
  "chain": "Aerie",
  "name": "Aerie Network",
  "rpc": [
    "https://aerie-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.aerielab.io"
  ],
  "slug": "aerie-network",
  "icon": {
    "url": "ipfs://bafkreig54jss26xllpjbclmfgwvot72m4ku7qxignhlqei6mijvwi2m4pu",
    "width": 1062,
    "height": 1069,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Aerie",
    "symbol": "AER",
    "decimals": 18
  },
  "infoURL": "https://aerielab.io/",
  "shortName": "Aerie",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Aerie Explorer",
      "url": "https://explorer.aerielab.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;