import type { Chain } from "../src/types";
export default {
  "name": "Dogechain Testnet",
  "chain": "DC",
  "icon": {
    "url": "ipfs://QmNS6B6L8FfgGSMTEi2SxD3bK5cdmKPNtQKcYaJeRWrkHs",
    "width": 732,
    "height": 732,
    "format": "png"
  },
  "rpc": [
    "https://dogechain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.dogechain.dog"
  ],
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
  "chainId": 568,
  "networkId": 568,
  "explorers": [
    {
      "name": "dogechain testnet explorer",
      "url": "https://explorer-testnet.dogechain.dog",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "dogechain-testnet"
} as const satisfies Chain;