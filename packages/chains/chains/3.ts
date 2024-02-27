import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 3,
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
  "networkId": 3,
  "redFlags": [],
  "rpc": [
    "https://3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ropsten.infura.io/v3/${INFURA_API_KEY}",
    "wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}"
  ],
  "shortName": "rop",
  "slip44": 1,
  "slug": "ropsten",
  "status": "deprecated",
  "testnet": false,
  "title": "Ethereum Testnet Ropsten"
} as const satisfies Chain;