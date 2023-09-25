import type { Chain } from "../src/types";
export default {
  "chainId": 4281033,
  "chain": "WCal",
  "name": "Worlds Caldera",
  "rpc": [
    "https://worlds-caldera.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://worlds-test.calderachain.xyz/http"
  ],
  "slug": "worlds-caldera",
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://caldera.xyz/",
  "shortName": "worldscal",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;