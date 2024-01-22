import type { Chain } from "../src/types";
export default {
  "chain": "RUBY",
  "chainId": 1821,
  "explorers": [
    {
      "name": "RUBY Smart Chain MAINNET Explorer",
      "url": "https://rubyscan.net",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmXGJevyPHHKT28hDfsJ9Cq2DQ2bAavdie37MEwFQUVCQz",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXGJevyPHHKT28hDfsJ9Cq2DQ2bAavdie37MEwFQUVCQz",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://rubychain.io",
  "name": "Ruby Smart Chain MAINNET",
  "nativeCurrency": {
    "name": "RUBY Smart Chain Native Token",
    "symbol": "RUBY",
    "decimals": 18
  },
  "networkId": 1821,
  "rpc": [
    "https://ruby-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1821.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-data.rubychain.io/",
    "https://mainnet.rubychain.io/"
  ],
  "shortName": "RUBY",
  "slip44": 1,
  "slug": "ruby-smart-chain",
  "testnet": false
} as const satisfies Chain;