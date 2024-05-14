import type { Chain } from "../src/types";
export default {
  "chain": "TEAM",
  "chainId": 88888888,
  "explorers": [
    {
      "name": "teamscan",
      "url": "https://teamblockchain.team",
      "standard": "EIP3091"
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
  "infoURL": "https://teamblockchain.team",
  "name": "T.E.A.M Blockchain",
  "nativeCurrency": {
    "name": "TEAM",
    "symbol": "$TEAM",
    "decimals": 18
  },
  "networkId": 88888888,
  "rpc": [
    "https://88888888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.teamblockchain.team"
  ],
  "shortName": "team",
  "slug": "t-e-a-m-blockchain",
  "testnet": false
} as const satisfies Chain;