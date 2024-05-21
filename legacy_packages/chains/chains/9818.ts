import type { Chain } from "../src/types";
export default {
  "chain": "tIMP",
  "chainId": 9818,
  "explorers": [
    {
      "name": "IMPERIUM TESTNET Explorer",
      "url": "https://network.impscan.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmcNGLzKyc7Gu2dgpBFF6t3KJwFuKC79D56DW8GTc5DWRw",
        "width": 200,
        "height": 200,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.imperiumchain.com/"
  ],
  "icon": {
    "url": "ipfs://QmcNGLzKyc7Gu2dgpBFF6t3KJwFuKC79D56DW8GTc5DWRw",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://imperiumchain.com",
  "name": "IMPERIUM TESTNET",
  "nativeCurrency": {
    "name": "tIMP",
    "symbol": "tIMP",
    "decimals": 18
  },
  "networkId": 9818,
  "rpc": [
    "https://9818.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-aws-testnet.imperiumchain.com",
    "https://data-aws2-testnet.imperiumchain.com"
  ],
  "shortName": "tIMP",
  "slip44": 1,
  "slug": "imperium-testnet",
  "testnet": true
} as const satisfies Chain;