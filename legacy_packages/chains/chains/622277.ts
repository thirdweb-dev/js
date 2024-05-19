import type { Chain } from "../src/types";
export default {
  "chain": "HYP",
  "chainId": 622277,
  "explorers": [
    {
      "name": "hypra",
      "url": "https://explorer.hypra.network",
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
  "infoURL": "https://www.hypra.network",
  "name": "Hypra Mainnet",
  "nativeCurrency": {
    "name": "Hypra",
    "symbol": "HYP",
    "decimals": 18
  },
  "networkId": 622277,
  "rpc": [
    "https://622277.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.hypra.network",
    "https://rpc.rethereum.org",
    "https://rethereum.rpc.restratagem.com",
    "https://rpc.rthcentral.org"
  ],
  "shortName": "hyp",
  "slug": "hypra",
  "testnet": false
} as const satisfies Chain;