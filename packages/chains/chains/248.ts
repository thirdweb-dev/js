import type { Chain } from "../src/types";
export default {
  "chain": "Oasys",
  "chainId": 248,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.oasys.games",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmT84suD2ZmTSraJBfeHhTNst2vXctQijNCztok9XiVcUR",
    "width": 3600,
    "height": 3600,
    "format": "png"
  },
  "infoURL": "https://oasys.games",
  "name": "Oasys Mainnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 248,
  "rpc": [
    "https://oasys.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://248.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.oasys.games"
  ],
  "shortName": "OAS",
  "slug": "oasys",
  "testnet": false
} as const satisfies Chain;