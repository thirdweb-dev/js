import type { Chain } from "../src/types";
export default {
  "chain": "Firechain",
  "chainId": 814,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYjuztyURb3Fc6ZTLgCbwQa64CcVoigF5j9cafzuSbqgf",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://docs.thefirechain.com/",
  "name": "Firechain zkEVM",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 814,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://zkevm.bridge.rpc.thefirechain.com"
      }
    ]
  },
  "rpc": [
    "https://firechain-zkevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://814.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zkevm.thefirechain.com"
  ],
  "shortName": "firechan-zkEVM",
  "slug": "firechain-zkevm",
  "testnet": false,
  "title": "Firechain zkEVM"
} as const satisfies Chain;