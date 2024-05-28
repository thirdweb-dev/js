import type { Chain } from "../src/types";
export default {
  "chain": "Metal L2",
  "chainId": 1750,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.metall2.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmesm61n8vVVDEeZU7npz39aQYofes9vMfXYwWM4JehLFS",
    "width": 250,
    "height": 250,
    "format": "svg"
  },
  "infoURL": "https://metall2.com",
  "name": "Metal L2",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1750,
  "rpc": [
    "https://1750.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metall2.com"
  ],
  "shortName": "metall2",
  "slug": "metal-l2",
  "testnet": false
} as const satisfies Chain;