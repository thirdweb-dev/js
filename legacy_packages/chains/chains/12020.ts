import type { Chain } from "../src/types";
export default {
  "chain": "Aternos",
  "chainId": 12020,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.aternoschain.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.aternoschain.com"
  ],
  "icon": {
    "url": "ipfs://QmUgfhv3rEsS6t9g6Lsf3TJ1mbnJqBrb8YUFPDiNG59QvT",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://aternoschain.com",
  "name": "Aternos",
  "nativeCurrency": {
    "name": "Aternos",
    "symbol": "ATR",
    "decimals": 18
  },
  "networkId": 12020,
  "rpc": [
    "https://12020.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.aternoschain.com"
  ],
  "shortName": "ATR",
  "slug": "aternos",
  "testnet": false
} as const satisfies Chain;