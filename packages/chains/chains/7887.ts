import type { Chain } from "../src/types";
export default {
  "chain": "Kinto Mainnet",
  "chainId": 7887,
  "explorers": [
    {
      "name": "Kinto Explorer",
      "url": "https://explorer.kinto.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmZw4zfR4Q8MD6MZRwkQrMeiiiu77AJffHdCMdemt4R2VM",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZw4zfR4Q8MD6MZRwkQrMeiiiu77AJffHdCMdemt4R2VM",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "infoURL": "https://kinto.xyz",
  "name": "Kinto Mainnet",
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 7887,
  "rpc": [
    "https://7887.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kinto.xyz/http",
    "https://kinto-mainnet.calderachain.xyz/http"
  ],
  "shortName": "kintoMainnet",
  "slug": "kinto",
  "testnet": false
} as const satisfies Chain;