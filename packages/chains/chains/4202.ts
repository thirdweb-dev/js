import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 4202,
  "explorers": [
    {
      "name": "liskscout",
      "url": "https://sepolia-blockscout.lisk.com",
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
  "infoURL": "https://lisk.com",
  "name": "Lisk Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 4202,
  "rpc": [
    "https://4202.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.sepolia-api.lisk.com"
  ],
  "shortName": "lisksep",
  "slip44": 134,
  "slug": "lisk-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;