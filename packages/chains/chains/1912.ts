import type { Chain } from "../src/types";
export default {
  "chain": "RUBY",
  "chainId": 1912,
  "explorers": [
    {
      "name": "RUBY Smart Chain Testnet Explorer",
      "url": "https://testnet.rubyscan.net",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmXGJevyPHHKT28hDfsJ9Cq2DQ2bAavdie37MEwFQUVCQz",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://claim-faucet.rubychain.io/"
  ],
  "icon": {
    "url": "ipfs://QmXGJevyPHHKT28hDfsJ9Cq2DQ2bAavdie37MEwFQUVCQz",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://rubychain.io",
  "name": "Ruby Smart Chain Testnet",
  "nativeCurrency": {
    "name": "RUBY Smart Chain Native Token",
    "symbol": "tRUBY",
    "decimals": 18
  },
  "networkId": 1912,
  "rpc": [
    "https://1912.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rchain.rubychain.io/"
  ],
  "shortName": "tRUBY",
  "slip44": 1,
  "slug": "ruby-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;