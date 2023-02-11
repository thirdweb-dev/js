export default {
  "name": "Rinkeby",
  "title": "Ethereum Testnet Rinkeby",
  "chain": "ETH",
  "rpc": [
    "https://rinkeby.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.infura.io/v3/${INFURA_API_KEY}",
    "wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}"
  ],
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
  "chainId": 4,
  "networkId": 4,
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
  "testnet": true,
  "slug": "rinkeby"
} as const;