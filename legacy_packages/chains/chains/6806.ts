import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 6806,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.racescan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.racetestnet.io/"
  ],
  "icon": {
    "url": "ipfs://QmQGaiPkSHc8ZGLAE4A8yZdFWLeuEts4VX6FjEqnuPXvxh",
    "width": 184,
    "height": 417,
    "format": "png"
  },
  "infoURL": "https://race.foundation/",
  "name": "RACE Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 6806,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://testnet-bridge.raceconomy.com/"
      }
    ]
  },
  "rpc": [
    "https://6806.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://racetestnet.io/"
  ],
  "shortName": "racesep",
  "slip44": 1,
  "slug": "race-testnet",
  "testnet": true
} as const satisfies Chain;