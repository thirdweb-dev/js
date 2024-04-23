import type { Chain } from "../src/types";
export default {
  "chain": "EVO",
  "chainId": 3424,
  "explorers": [
    {
      "name": "Evolve Mainnet Explorer",
      "url": "https://evoexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmVxtpYYzc5214CB7BgsMC4mRNRHCD8fpbNMzZguBWyRwa",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://evolveblockchain.io",
  "name": "EVOLVE Mainnet",
  "nativeCurrency": {
    "name": "Evolve",
    "symbol": "EVO",
    "decimals": 18
  },
  "networkId": 3424,
  "rpc": [
    "https://3424.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.evolveblockchain.io"
  ],
  "shortName": "EVOm",
  "slug": "evolve",
  "testnet": false
} as const satisfies Chain;