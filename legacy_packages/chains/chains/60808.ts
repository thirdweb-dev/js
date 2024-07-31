import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 60808,
  "explorers": [
    {
      "name": "bobscout",
      "url": "https://explorer.gobob.xyz",
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
    "url": "ipfs://QmaX5iqQTrJD8TBuvoT97xPMG6LYamjPCPnZUUMh12jc99",
    "width": 297,
    "height": 378,
    "format": "png"
  },
  "infoURL": "https://gobob.xyz",
  "name": "BOB",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 60808,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://app.gobob.xyz"
      }
    ]
  },
  "rpc": [
    "https://60808.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gobob.xyz",
    "wss://rpc.gobob.xyz",
    "https://bob-mainnet.public.blastapi.io",
    "wss://bob-mainnet.public.blastapi.io"
  ],
  "shortName": "bob",
  "slug": "bob",
  "status": "active",
  "testnet": false
} as const satisfies Chain;