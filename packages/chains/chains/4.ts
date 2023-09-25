import type { Chain } from "../src/types";
export default {
  "chainId": 4,
  "chain": "ETH",
  "name": "Rinkeby",
  "rpc": [
    "https://rinkeby.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.infura.io/v3/${INFURA_API_KEY}",
    "wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}"
  ],
  "slug": "rinkeby",
  "faucets": [
    "http://fauceth.komputing.org?chain=4&address=${ADDRESS}",
    "https://faucet.rinkeby.io"
  ],
  "nativeCurrency": {
    "name": "Rinkeby Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.rinkeby.io",
  "shortName": "rin",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "etherscan-rinkeby",
      "url": "https://rinkeby.etherscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;