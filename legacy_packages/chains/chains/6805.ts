import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 6805,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://racescan.io",
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
    "url": "ipfs://QmQGaiPkSHc8ZGLAE4A8yZdFWLeuEts4VX6FjEqnuPXvxh",
    "width": 184,
    "height": 417,
    "format": "png"
  },
  "infoURL": "https://race.foundation/",
  "name": "RACE Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 6805,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.race.foundation/"
      }
    ]
  },
  "rpc": [
    "https://6805.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://racemainnet.io/"
  ],
  "shortName": "raceeth",
  "slip44": 1,
  "slug": "race",
  "testnet": false
} as const satisfies Chain;