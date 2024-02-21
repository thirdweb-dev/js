import type { Chain } from "../src/types";
export default {
  "chain": "BDCC",
  "chainId": 188710,
  "explorers": [
    {
      "name": "Bitica DPOS Blockchain Explorer",
      "url": "https://biticablockchain.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://biticablockchain.com/",
  "name": "Bitica Chain Mainnet",
  "nativeCurrency": {
    "name": "Bitica Coin",
    "symbol": "BDCC",
    "decimals": 18
  },
  "networkId": 188710,
  "rpc": [
    "https://188710.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.biticablockchain.com/"
  ],
  "shortName": "bdcc",
  "slug": "bitica-chain",
  "testnet": false
} as const satisfies Chain;