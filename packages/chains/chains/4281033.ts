import type { Chain } from "../src/types";
export default {
  "chain": "WCal",
  "chainId": 4281033,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "infoURL": "https://caldera.xyz/",
  "name": "Worlds Caldera",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 4281033,
  "rpc": [
    "https://worlds-caldera.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4281033.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://worlds-test.calderachain.xyz/http"
  ],
  "shortName": "worldscal",
  "slug": "worlds-caldera",
  "testnet": true
} as const satisfies Chain;