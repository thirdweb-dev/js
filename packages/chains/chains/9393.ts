import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 9393,
  "explorers": [
    {
      "name": "basescout",
      "url": "https://sepolia-delascan.deperp.com",
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
    "url": "ipfs://QmZQbfJfxYez8iQyVsB65y7ZTssKbgUpMXzPTEk5xGDwQB",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://www.deperp.com/dela",
  "name": "Dela Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 9393,
  "rpc": [
    "https://9393.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-dela.deperp.com"
  ],
  "shortName": "delasep",
  "slip44": 1,
  "slug": "dela-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;