import type { Chain } from "../src/types";
export default {
  "chainId": 29032022,
  "chain": "FLX",
  "name": "Flachain Mainnet",
  "rpc": [
    "https://flachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://flachain.flaexchange.top/"
  ],
  "slug": "flachain",
  "icon": {
    "url": "ipfs://bafybeiadlvc4pfiykehyt2z67nvgt5w4vlov27olu5obvmryv4xzua4tae",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Flacoin",
    "symbol": "FLA",
    "decimals": 18
  },
  "infoURL": "https://www.flaexchange.top",
  "shortName": "fla",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "FLXExplorer",
      "url": "https://explorer.flaexchange.top",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;