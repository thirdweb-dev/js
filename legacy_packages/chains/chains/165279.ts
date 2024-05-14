import type { Chain } from "../src/types";
export default {
  "chain": "Eclat",
  "chainId": 165279,
  "explorers": [
    {
      "name": "Eclat Mainnet Explorer",
      "url": "https://eclatscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeigpyvnir6awzgeazkk5xdkvexw7w6ww3yxawszue6zms4a5ygdfky",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://eclatscan.com",
  "name": "Eclat Mainnet",
  "nativeCurrency": {
    "name": "Eclat",
    "symbol": "ECLAT",
    "decimals": 18
  },
  "networkId": 165279,
  "rpc": [
    "https://165279.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.eclatscan.com"
  ],
  "shortName": "ECLAT",
  "slug": "eclat",
  "testnet": false
} as const satisfies Chain;