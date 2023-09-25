import type { Chain } from "../src/types";
export default {
  "chainId": 9818,
  "chain": "tIMP",
  "name": "IMPERIUM TESTNET",
  "rpc": [
    "https://imperium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-aws-testnet.imperiumchain.com",
    "https://data-aws2-testnet.imperiumchain.com"
  ],
  "slug": "imperium-testnet",
  "icon": {
    "url": "ipfs://QmcNGLzKyc7Gu2dgpBFF6t3KJwFuKC79D56DW8GTc5DWRw",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [
    "https://faucet.imperiumchain.com/"
  ],
  "nativeCurrency": {
    "name": "tIMP",
    "symbol": "tIMP",
    "decimals": 18
  },
  "infoURL": "https://imperiumchain.com",
  "shortName": "tIMP",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "IMPERIUM TESTNET Explorer",
      "url": "https://network.impscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;