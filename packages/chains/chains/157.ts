import type { Chain } from "../src/types";
export default {
  "chain": "Puppynet Shibarium",
  "chainId": 157,
  "explorers": [
    {
      "name": "puppyscan",
      "url": "https://puppyscan.shib.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://beta.shibariumtech.com/faucet"
  ],
  "icon": {
    "url": "ipfs://QmYNVkoZgRjDBQzJz6kog9mA2yPzQFW2oSKvhnkwuBhLQE",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://shibariumecosystem.com",
  "name": "Puppynet Shibarium",
  "nativeCurrency": {
    "name": "BONE",
    "symbol": "BONE",
    "decimals": 18
  },
  "networkId": 157,
  "rpc": [
    "https://puppynet-shibarium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://157.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://puppynet.shibrpc.com"
  ],
  "shortName": "puppynet",
  "slug": "puppynet-shibarium",
  "testnet": false
} as const satisfies Chain;