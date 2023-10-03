import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 3,
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://ropsten.etherscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://fauceth.komputing.org?chain=3&address=${ADDRESS}",
    "https://faucet.ropsten.be?${ADDRESS}"
  ],
  "features": [],
  "infoURL": "https://github.com/ethereum/ropsten",
  "name": "Ropsten",
  "nativeCurrency": {
    "name": "Ropsten Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ropsten.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ropsten.infura.io/v3/${INFURA_API_KEY}",
    "wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}"
  ],
  "shortName": "rop",
  "slug": "ropsten",
  "testnet": true
} as const satisfies Chain;