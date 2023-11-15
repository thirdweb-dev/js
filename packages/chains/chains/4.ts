import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 4,
  "ens": {
    "registry": "0xe7410170f87102df0055eb195163a03b7f2bff4a"
  },
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
  "infoURL": "https://www.rinkeby.io",
  "name": "Rinkeby",
  "nativeCurrency": {
    "name": "Rinkeby Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 4,
  "rpc": [
    "https://rinkeby.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.infura.io/v3/${INFURA_API_KEY}",
    "wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}"
  ],
  "shortName": "rin",
  "slug": "rinkeby",
  "testnet": true,
  "title": "Ethereum Testnet Rinkeby"
} as const satisfies Chain;