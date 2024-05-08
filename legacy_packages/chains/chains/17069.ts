import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 17069,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.garnetchain.com",
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
  "features": [],
  "icon": {
    "url": "ipfs://QmWhHvjbjTiNNsHKpbEz9rxSt4CCL2Q5xVZjk8eQkp82B9",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://redstone.xyz",
  "name": "Garnet Holesky",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 17069,
  "parent": {
    "type": "L2",
    "chain": "eip155-17000",
    "bridges": [
      {
        "url": "https://garnetchain.com/deposit"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://17069.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.garnetchain.com",
    "wss://rpc.garnetchain.com"
  ],
  "shortName": "garnet",
  "slug": "garnet-holesky",
  "testnet": true
} as const satisfies Chain;