import type { Chain } from "../src/types";
export default {
  "name": "LaTestnet",
  "chain": "LaTestnet",
  "icon": {
    "url": "ipfs://bafkreiecoqvit2mikpbpbtzy2zrn6e7fvqdegm72sdcathdwmgiyuzey7u",
    "width": 104,
    "height": 114,
    "format": "png"
  },
  "rpc": [
    "https://latestnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.lachain.network"
  ],
  "faucets": [
    "https://faucet.lachain.network"
  ],
  "nativeCurrency": {
    "name": "Test LaCoin",
    "symbol": "TLA",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "",
  "shortName": "latestnet",
  "chainId": 418,
  "networkId": 418,
  "explorers": [
    {
      "name": "LaTestnet Explorer",
      "url": "https://testexplorer.lachain.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "latestnet"
} as const satisfies Chain;