import type { Chain } from "../src/types";
export default {
  "chain": "LAOS",
  "chainId": 6283,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.laos.laosfoundation.io",
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
    "url": "ipfs://QmR8HgbKrHys8QFtH99soGx9KreixpCXJqkFejJdhpyNGo",
    "width": 1220,
    "height": 1220,
    "format": "png"
  },
  "infoURL": "https://laosnetwork.io",
  "name": "LAOS",
  "nativeCurrency": {
    "name": "LAOS",
    "symbol": "LAOS",
    "decimals": 18
  },
  "networkId": 6283,
  "rpc": [
    "https://6283.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.laos.laosfoundation.io",
    "wss://rpc.laos.laosfoundation.io"
  ],
  "shortName": "laosnetwork",
  "slug": "laos",
  "testnet": false,
  "title": "LAOS Mainnet"
} as const satisfies Chain;