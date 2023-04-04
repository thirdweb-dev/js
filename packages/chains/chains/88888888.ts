import type { Chain } from "../src/types";
export default {
  "name": "T.E.A.M Blockchain",
  "chain": "TEAM",
  "icon": {
    "url": "ipfs://QmcnA15BLE9uvznbugXKjqquizZs1eLPeEEkc92DSmvhmt",
    "width": 248,
    "height": 248,
    "format": "png"
  },
  "rpc": [
    "https://t-e-a-m-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.teamblockchain.team"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TEAM",
    "symbol": "$TEAM",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://teamblockchain.team",
  "shortName": "team",
  "chainId": 88888888,
  "networkId": 88888888,
  "explorers": [
    {
      "name": "teamscan",
      "url": "https://teamblockchain.team",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "t-e-a-m-blockchain"
} as const satisfies Chain;