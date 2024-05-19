import type { Chain } from "../src/types";
export default {
  "chain": "TQF",
  "chainId": 8194,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.toruscan.com",
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
  "infoURL": "https://docs.toruschain.com",
  "name": "Torus Testnet",
  "nativeCurrency": {
    "name": "tTQF",
    "symbol": "TTQF",
    "decimals": 18
  },
  "networkId": 8194,
  "rpc": [
    "https://8194.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.toruschain.com"
  ],
  "shortName": "ttqf",
  "slip44": 1,
  "slug": "torus-testnet",
  "testnet": true
} as const satisfies Chain;