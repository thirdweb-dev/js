import type { Chain } from "../src/types";
export default {
  "chainId": 248,
  "chain": "Oasys",
  "name": "Oasys Mainnet",
  "rpc": [
    "https://oasys.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.oasys.games"
  ],
  "slug": "oasys",
  "icon": {
    "url": "ipfs://QmT84suD2ZmTSraJBfeHhTNst2vXctQijNCztok9XiVcUR",
    "width": 3600,
    "height": 3600,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://oasys.games",
  "shortName": "OAS",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.oasys.games",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;