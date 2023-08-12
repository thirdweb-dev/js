import type { Chain } from "../src/types";
export default {
  "name": "IMPERIUM TESTNET",
  "chain": "tIMP",
  "rpc": [
    "https://imperium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-aws-testnet.imperiumchain.com",
    "https://data-aws2-testnet.imperiumchain.com"
  ],
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
  "chainId": 9818,
  "networkId": 9818,
  "icon": {
    "url": "ipfs://QmcNGLzKyc7Gu2dgpBFF6t3KJwFuKC79D56DW8GTc5DWRw",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "explorers": [
    {
      "name": "IMPERIUM TESTNET Explorer",
      "icon": {
        "url": "ipfs://QmcNGLzKyc7Gu2dgpBFF6t3KJwFuKC79D56DW8GTc5DWRw",
        "width": 200,
        "height": 200,
        "format": "png"
      },
      "url": "https://network.impscan.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "imperium-testnet"
} as const satisfies Chain;