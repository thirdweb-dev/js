import type { Chain } from "../src/types";
export default {
  "chain": "REBUS",
  "chainId": 3033,
  "explorers": [
    {
      "name": "Rebus EVM Explorer (Blockscout)",
      "url": "https://evm.testnet.rebus.money",
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
      "url": "https://testnet.rebus.money/rebustestnet",
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
  "name": "Rebus Testnet",
  "nativeCurrency": {
    "name": "Rebus",
    "symbol": "REBUS",
    "decimals": 18
  },
  "networkId": 3033,
  "rpc": [
    "https://3033.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rebus.money/rpc"
  ],
  "shortName": "rebus-testnet",
  "slug": "rebus-testnet",
  "testnet": true,
  "title": "Rebuschain Testnet"
} as const satisfies Chain;