import type { Chain } from "../src/types";
export default {
  "name": "Ropsten",
  "title": "Ethereum Testnet Ropsten",
  "chain": "ETH",
  "rpc": [],
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
  "chainId": 3,
  "networkId": 3,
  "ens": {
    "registry": "0x112234455c3a32fd11230c42e7bccd4a84e02010"
  },
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://ropsten.etherscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "ropsten"
} as const satisfies Chain;