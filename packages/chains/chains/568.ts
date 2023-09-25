import type { Chain } from "../src/types";
export default {
  "chainId": 568,
  "chain": "DC",
  "name": "Dogechain Testnet",
  "rpc": [
    "https://dogechain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.dogechain.dog"
  ],
  "slug": "dogechain-testnet",
  "icon": {
    "url": "ipfs://QmNS6B6L8FfgGSMTEi2SxD3bK5cdmKPNtQKcYaJeRWrkHs",
    "width": 732,
    "height": 732,
    "format": "png"
  },
  "faucets": [
    "https://faucet.dogechain.dog"
  ],
  "nativeCurrency": {
    "name": "Dogecoin",
    "symbol": "DOGE",
    "decimals": 18
  },
  "infoURL": "https://dogechain.dog",
  "shortName": "dct",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "dogechain testnet explorer",
      "url": "https://explorer-testnet.dogechain.dog",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;