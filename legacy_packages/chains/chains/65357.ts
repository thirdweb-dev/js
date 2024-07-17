import type { Chain } from "../src/types";
export default {
  "chain": "VE",
  "chainId": 65357,
  "explorers": [
    {
      "name": "vecno",
      "url": "https://explorer.vecno.org",
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
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmXPmM55AvkpEmqCvfP9YNQV1xsRdsPZDzwp6QHVThw6Wv",
    "width": 200,
    "height": 200,
    "format": "svg"
  },
  "infoURL": "https://vecno.org",
  "name": "Vecno Mainnet",
  "nativeCurrency": {
    "name": "Vecno",
    "symbol": "VE",
    "decimals": 18
  },
  "networkId": 65357,
  "rpc": [
    "https://65357.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.vecno.org"
  ],
  "shortName": "ve",
  "slug": "vecno",
  "testnet": false
} as const satisfies Chain;