import type { Chain } from "../src/types";
export default {
  "chain": "SGB",
  "chainId": 19,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://songbird-explorer.flare.network",
      "standard": "EIP3091"
    },
    {
      "name": "flarescan",
      "url": "https://songbird.flarescan.com",
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
  "icon": {
    "url": "ipfs://QmdpaH9pEFDXB4tUPxcqAHfB3Sfx3BQufz6EAzBWhHH6Ka",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://flare.network",
  "name": "Songbird Canary-Network",
  "nativeCurrency": {
    "name": "Songbird",
    "symbol": "SGB",
    "decimals": 18
  },
  "networkId": 19,
  "rpc": [
    "https://19.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://songbird-api.flare.network/ext/C/rpc",
    "https://rpc.ftso.au/songbird",
    "https://songbird.enosys.global/ext/C/rpc",
    "https://songbird.solidifi.app/ext/C/rpc"
  ],
  "shortName": "sgb",
  "slug": "songbird-canary-network",
  "testnet": false
} as const satisfies Chain;