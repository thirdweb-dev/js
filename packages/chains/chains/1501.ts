import type { Chain } from "../src/types";
export default {
  "name": "BEVM",
  "chain": "ChainX",
  "rpc": [
    "https://bevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.chainx.org/rpc",
    "https://mainnet2.chainx.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://chainx.org",
  "shortName": "chainx",
  "chainId": 1501,
  "networkId": 1501,
  "explorers": [
    {
      "name": "bevm scan",
      "url": "https://evm.chainx.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "bevm"
} as const satisfies Chain;