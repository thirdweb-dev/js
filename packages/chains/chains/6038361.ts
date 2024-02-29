import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 6038361,
  "explorers": [
    {
      "name": "Blockscout zKyoto chain explorer",
      "url": "https://astar-zkyoto.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRySLe3su59dE5x5JPm2b1GeZfz6DR9qUzcbp3rt4SD3A",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://astar.network",
  "name": "Astar zKyoto",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 6038361,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://portal.astar.network"
      },
      {
        "url": "https://bridge.gelato.network/bridge/astar-zkyoto"
      }
    ]
  },
  "rpc": [
    "https://6038361.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.startale.com/zkyoto",
    "https://rpc.zkyoto.gelato.digital"
  ],
  "shortName": "azkyt",
  "slug": "astar-zkyoto",
  "status": "incubating",
  "testnet": true,
  "title": "Astar zkEVM Testnet zKyoto"
} as const satisfies Chain;