import type { Chain } from "../src/types";
export default {
  "chain": "INNOVATOR",
  "chainId": 129,
  "explorers": [
    {
      "name": "Innovator Explorer",
      "url": "https://evm.innovatorchain.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmVJBGeFYZXMQqicNdzctMfvPN5CrtRrfZBTw3CEpkCBsS",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "infoURL": "https://innovatorchain.com",
  "name": "Innovator Chain",
  "nativeCurrency": {
    "name": "INOV8",
    "symbol": "INOV8",
    "decimals": 18
  },
  "networkId": 129,
  "rpc": [
    "https://innovator-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://129.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.innovatorchain.com"
  ],
  "shortName": "Innovator",
  "slug": "innovator-chain",
  "testnet": false
} as const satisfies Chain;