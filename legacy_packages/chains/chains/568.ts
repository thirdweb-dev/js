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
  "infoURL": "https://dogechain.dog",
  "name": "Dogechain Testnet",
  "nativeCurrency": {
    "name": "Dogecoin",
    "symbol": "DOGE",
    "decimals": 18
  },
  "networkId": 568,
  "rpc": [
    "https://568.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.dogechain.dog"
  ],
  "shortName": "dct",
  "slip44": 1,
  "slug": "dogechain-testnet",
  "testnet": true
} as const satisfies Chain;