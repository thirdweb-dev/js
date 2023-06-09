import type { Chain } from "../src/types";
export default {
  "name": "LaTestnet",
  "chain": "LaTestnet",
  "icon": {
    "url": "ipfs://QmQxGA6rhuCQDXUueVcNvFRhMEWisyTmnF57TqL7h6k6cZ",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "rpc": [
    "https://latestnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.lachain.network",
    "https://lachain-testnet.rpc-nodes.cedalio.dev"
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