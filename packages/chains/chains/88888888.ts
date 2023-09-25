import type { Chain } from "../src/types";
export default {
  "chainId": 88888888,
  "chain": "TEAM",
  "name": "T.E.A.M Blockchain",
  "rpc": [
    "https://t-e-a-m-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.teamblockchain.team"
  ],
  "slug": "t-e-a-m-blockchain",
  "icon": {
    "url": "ipfs://QmcnA15BLE9uvznbugXKjqquizZs1eLPeEEkc92DSmvhmt",
    "width": 248,
    "height": 248,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "TEAM",
    "symbol": "$TEAM",
    "decimals": 18
  },
  "infoURL": "https://teamblockchain.team",
  "shortName": "team",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "teamscan",
      "url": "https://teamblockchain.team",
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