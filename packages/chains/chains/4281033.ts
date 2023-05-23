import type { Chain } from "../src/types";
export default {
  "name": "Worlds Caldera",
  "chain": "WCal",
  "rpc": [
    "https://worlds-caldera.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://worlds-test.calderachain.xyz/http"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
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
  "infoURL": "https://caldera.xyz/",
  "shortName": "worldscal",
  "chainId": 4281033,
  "networkId": 4281033,
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "explorers": [],
  "testnet": true,
  "slug": "worlds-caldera"
} as const satisfies Chain;