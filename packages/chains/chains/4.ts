import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 4,
  "explorers": [
    {
      "name": "etherscan-rinkeby",
      "url": "https://rinkeby.etherscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://fauceth.komputing.org?chain=4&address=${ADDRESS}",
    "https://faucet.rinkeby.io"
  ],
  "features": [],
  "infoURL": "https://www.rinkeby.io",
  "name": "Rinkeby",
  "nativeCurrency": {
    "name": "Rinkeby Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://rinkeby.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.infura.io/v3/${INFURA_API_KEY}",
    "wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}"
  ],
  "shortName": "rin",
  "slug": "rinkeby",
  "testnet": true
} as const satisfies Chain;