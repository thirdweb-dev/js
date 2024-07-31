import type { Chain } from "../src/types";
export default {
  "chain": "TATC",
  "chainId": 490000,
  "explorers": [
    {
      "name": "astral",
      "url": "https://nova.subspace.network",
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
  "infoURL": "https://www.autonomys.net",
  "name": "Autonomys Testnet Nova Domain",
  "nativeCurrency": {
    "name": "Test Auto Coin",
    "symbol": "TATC",
    "decimals": 18
  },
  "networkId": 490000,
  "rpc": [
    "https://490000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nova-0.gemini-3h.subspace.network/ws"
  ],
  "shortName": "ATN",
  "slug": "autonomys-testnet-nova-domain",
  "testnet": true
} as const satisfies Chain;