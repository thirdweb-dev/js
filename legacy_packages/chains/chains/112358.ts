import type { Chain } from "../src/types";
export default {
  "chain": "METAO",
  "chainId": 112358,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.metachain.one",
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
  "infoURL": "https://metachain.one",
  "name": "Metachain One Mainnet",
  "nativeCurrency": {
    "name": "Metao",
    "symbol": "METAO",
    "decimals": 18
  },
  "networkId": 112358,
  "rpc": [
    "https://112358.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metachain.one",
    "https://rpc2.metachain.one"
  ],
  "shortName": "metao",
  "slug": "metachain-one",
  "testnet": false
} as const satisfies Chain;