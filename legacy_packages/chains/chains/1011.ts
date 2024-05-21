import type { Chain } from "../src/types";
export default {
  "chain": "REBUS",
  "chainId": 1011,
  "explorers": [
    {
      "name": "Rebus EVM Explorer (Blockscout)",
      "url": "https://evm.rebuschain.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreifzag46dhp33vb2uldg4htqbqipuqrapjga6ml6pnhn5yibbvb4gq",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    },
    {
      "name": "Rebus Cosmos Explorer (ping.pub)",
      "url": "https://cosmos.rebuschain.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreifzag46dhp33vb2uldg4htqbqipuqrapjga6ml6pnhn5yibbvb4gq",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreifzag46dhp33vb2uldg4htqbqipuqrapjga6ml6pnhn5yibbvb4gq",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.rebuschain.com",
  "name": "Rebus Mainnet",
  "nativeCurrency": {
    "name": "Rebus",
    "symbol": "REBUS",
    "decimals": 18
  },
  "networkId": 1011,
  "rpc": [
    "https://1011.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://apievm.rebuschain.com/rpc"
  ],
  "shortName": "rebus",
  "slug": "rebus",
  "testnet": false,
  "title": "Rebuschain Mainnet"
} as const satisfies Chain;