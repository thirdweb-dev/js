import type { Chain } from "../src/types";
export default {
  "chain": "Metal L2 Testnet",
  "chainId": 1740,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.explorer.metall2.com",
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
  "name": "Metal L2 Testnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1740,
  "rpc": [
    "https://1740.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.metall2.com"
  ],
  "shortName": "metall2-testnet",
  "slug": "metal-l2-testnet",
  "testnet": true
} as const satisfies Chain;