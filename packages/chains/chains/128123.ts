import type { Chain } from "../src/types";
export default {
  "chain": "Etherlink",
  "chainId": 128123,
  "explorers": [
    {
      "name": "Etherlink Testnet Explorer",
      "url": "https://testnet-explorer.etherlink.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.etherlink.com"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmVqE4wq3fd3RKZwo7GxmW333ywHgYBZGvqwh3TUBM5DUi",
    "width": 3600,
    "height": 3600,
    "format": "PNG"
  },
  "infoURL": "https://node.ghostnet.etherlink.com",
  "name": "Etherlink Testnet",
  "nativeCurrency": {
    "name": "tez",
    "symbol": "XTZ",
    "decimals": 18
  },
  "networkId": 128123,
  "parent": {
    "type": "Etherlink",
    "chain": "Etherlink",
    "bridges": []
  },
  "redFlags": [],
  "rpc": [
    "https://etherlink-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://128123.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.ghostnet.etherlink.com"
  ],
  "shortName": "etlt",
  "slug": "etherlink-testnet",
  "testnet": true
} as const satisfies Chain;