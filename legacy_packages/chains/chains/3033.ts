import type { Chain } from "../src/types";
export default {
  "chain": "REBUS",
  "chainId": 3033,
  "explorers": [
    {
      "name": "Rebus EVM Explorer (Blockscout)",
      "url": "https://evm.testnet.rebus.money",
      "standard": "none"
    },
    {
      "name": "Rebus Cosmos Explorer (ping.pub)",
      "url": "https://testnet.rebus.money/rebustestnet",
      "standard": "none"
    }
  ],
  "faucets": [],
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