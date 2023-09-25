import type { Chain } from "../src/types";
export default {
  "chainId": 3,
  "chain": "ETH",
  "name": "Ropsten",
  "rpc": [
    "https://ropsten.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ropsten.infura.io/v3/${INFURA_API_KEY}",
    "wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}"
  ],
  "slug": "ropsten",
  "faucets": [
    "http://fauceth.komputing.org?chain=3&address=${ADDRESS}",
    "https://faucet.ropsten.be?${ADDRESS}"
  ],
  "nativeCurrency": {
    "name": "Ropsten Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://github.com/ethereum/ropsten",
  "shortName": "rop",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://ropsten.etherscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;