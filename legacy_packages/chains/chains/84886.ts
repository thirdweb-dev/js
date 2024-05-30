import type { Chain } from "../src/types";
export default {
  "chain": "Aerie",
  "chainId": 84886,
  "explorers": [
    {
      "name": "Aerie Explorer",
      "url": "https://explorer.aerielab.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreig54jss26xllpjbclmfgwvot72m4ku7qxignhlqei6mijvwi2m4pu",
        "width": 1062,
        "height": 1069,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreig54jss26xllpjbclmfgwvot72m4ku7qxignhlqei6mijvwi2m4pu",
    "width": 1062,
    "height": 1069,
    "format": "png"
  },
  "infoURL": "https://aerielab.io/",
  "name": "Aerie Network",
  "nativeCurrency": {
    "name": "Aerie",
    "symbol": "AER",
    "decimals": 18
  },
  "networkId": 84886,
  "rpc": [
    "https://84886.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.aerielab.io"
  ],
  "shortName": "Aerie",
  "slug": "aerie-network",
  "testnet": false
} as const satisfies Chain;