import type { Chain } from "../src/types";
export default {
  "chain": "EVO",
  "chainId": 14324,
  "explorers": [
    {
      "name": "Evolve Testnet Explorer",
      "url": "https://testnet.evolveblockchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.evolveblockchain.io"
  ],
  "icon": {
    "url": "ipfs://QmVxtpYYzc5214CB7BgsMC4mRNRHCD8fpbNMzZguBWyRwa",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://evolveblockchain.io",
  "name": "EVOLVE Testnet",
  "nativeCurrency": {
    "name": "Evolve",
    "symbol": "EVO",
    "decimals": 18
  },
  "networkId": 14324,
  "rpc": [
    "https://14324.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.evolveblockchain.io"
  ],
  "shortName": "evo",
  "slug": "evolve-testnet",
  "testnet": true
} as const satisfies Chain;