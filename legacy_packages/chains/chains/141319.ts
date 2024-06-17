import type { Chain } from "../src/types";
export default {
  "chain": "MagApe",
  "chainId": 141319,
  "explorers": [
    {
      "name": "etherscan",
      "url": "http://testnet-api.magape.io:81",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://magape.io",
  "name": "MagApe Testnet",
  "nativeCurrency": {
    "name": "MagApe",
    "symbol": "MAG",
    "decimals": 18
  },
  "networkId": 141319,
  "rpc": [
    "https://141319.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-api.magape.io/chain/"
  ],
  "shortName": "mag",
  "slug": "magape-testnet",
  "testnet": true,
  "title": "MagApeChain"
} as const satisfies Chain;