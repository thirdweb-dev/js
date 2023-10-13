import type { Chain } from "../src/types";
export default {
  "chain": "DC",
  "chainId": 568,
  "explorers": [
    {
      "name": "dogechain testnet explorer",
      "url": "https://explorer-testnet.dogechain.dog",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.dogechain.dog"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmNS6B6L8FfgGSMTEi2SxD3bK5cdmKPNtQKcYaJeRWrkHs",
    "width": 732,
    "height": 732,
    "format": "png"
  },
  "infoURL": "https://dogechain.dog",
  "name": "Dogechain Testnet",
  "nativeCurrency": {
    "name": "Dogecoin",
    "symbol": "DOGE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dogechain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.dogechain.dog"
  ],
  "shortName": "dct",
  "slug": "dogechain-testnet",
  "testnet": true
} as const satisfies Chain;