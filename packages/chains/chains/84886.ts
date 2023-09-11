import type { Chain } from "../src/types";
export default {
  "name": "Aerie Network",
  "chain": "Aerie",
  "rpc": [
    "https://aerie-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.aerielab.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Aerie",
    "symbol": "AER",
    "decimals": 18
  },
  "infoURL": "https://aerielab.io/",
  "shortName": "Aerie",
  "chainId": 84886,
  "networkId": 84886,
  "icon": {
    "url": "ipfs://bafkreig54jss26xllpjbclmfgwvot72m4ku7qxignhlqei6mijvwi2m4pu",
    "width": 1062,
    "height": 1069,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Aerie Explorer",
      "url": "https://explorer.aerielab.io",
      "icon": {
        "url": "ipfs://bafkreig54jss26xllpjbclmfgwvot72m4ku7qxignhlqei6mijvwi2m4pu",
        "width": 1062,
        "height": 1069,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "aerie-network"
} as const satisfies Chain;