import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 3776,
  "explorers": [
    {
      "name": "Blockscout Astar zkEVM explorer",
      "url": "https://astar-zkevm.explorer.startale.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmRySLe3su59dE5x5JPm2b1GeZfz6DR9qUzcbp3rt4SD3A",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://astar.network",
  "name": "Astar zkEVM",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 3776,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/astar-zkevm"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://3776.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.startale.com/astar-zkevm"
  ],
  "shortName": "astarzk",
  "slug": "astar-zkevm",
  "testnet": false,
  "title": "Astar zkEVM Mainnet"
} as const satisfies Chain;